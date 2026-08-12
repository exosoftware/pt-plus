/** @odoo-module */
import {PosStore} from "@point_of_sale/app/services/pos_store";
import {AlertDialog} from "@web/core/confirmation_dialog/confirmation_dialog";
import {ask} from "@point_of_sale/app/utils/make_awaitable_dialog";
import {_t} from "@web/core/l10n/translation";
import {patch} from "@web/core/utils/patch";

patch(PosStore.prototype, {
    isOrderBillLocked(order) {
        return Boolean(order?.l10n_pt_bill_unique_id || order?._l10n_pt_bill_locked);
    },

    async updateOrderWithPTBillDetails(order, orderServerIds = []) {
        const validOrderIds = orderServerIds.filter((id) => typeof id === "number");
        if (!validOrderIds.length) {
            return;
        }

        const [savedOrder] = await this.data.searchRead(
            "pos.order",
            [["id", "in", validOrderIds]],
            [
                "l10n_pt_bill_atcud",
                "l10n_pt_bill_certification_text",
                "l10n_pt_bill_doc_name",
                "l10n_pt_bill_qr_code",
                "l10n_pt_bill_unique_id",
                "l10n_pt_is_bill",
            ]
        );

        if (!savedOrder) {
            return;
        }

        order.l10n_pt_bill_unique_id = savedOrder.l10n_pt_bill_unique_id;
        order.l10n_pt_bill_doc_name = savedOrder.l10n_pt_bill_doc_name;
        order.l10n_pt_bill_qr_code = savedOrder.l10n_pt_bill_qr_code;
        order.l10n_pt_bill_atcud = savedOrder.l10n_pt_bill_atcud;
        order.l10n_pt_bill_certification_text =
            savedOrder.l10n_pt_bill_certification_text;
        order.l10n_pt_is_bill = savedOrder.l10n_pt_is_bill;
        order._l10n_pt_bill_locked = Boolean(
            savedOrder.l10n_pt_bill_unique_id || savedOrder.l10n_pt_is_bill
        );
    },

    getReceiptHeaderData(order) {
        const result = super.getReceiptHeaderData(...arguments);
        if (order) {
            result.l10n_pt_bill_doc_name = order.l10n_pt_bill_doc_name;
        }
        return result;
    },

    async onDeleteOrder(order) {
        if (!this.isOrderBillLocked(order)) {
            return await super.onDeleteOrder(order);
        }
        this.showPopupBlockDelete();
        return false;
    },

    async _onBeforeDeleteOrder(order) {
        if (!this.isOrderBillLocked(order)) {
            return await super._onBeforeDeleteOrder(...arguments);
        }
        this.showPopupBlockDelete();
        return false;
    },

    async addLineToCurrentOrder(vals, opts = {}, configure = true) {
        const order = this.getOrder();
        if (
            this.config.l10n_pt_invoicing &&
            this.isOrderBillLocked(order) &&
            !(await this.showPopupBlockModify(order))
        ) {
            return;
        }
        return await super.addLineToCurrentOrder(vals, opts, configure);
    },

    showPopupBlockDelete() {
        this.dialog.add(AlertDialog, {
            title: _t("Order Deletion Unsuccessful"),
            body: _t(
                "The deletion operation could not be" +
                    " completed because the bill for this order has already " +
                    "been printed."
            ),
        });
    },

    _cloneBillOrderCourses(sourceOrder, targetOrder) {
        const clonedCoursesByUuid = new Map();
        for (const course of sourceOrder.course_ids || []) {
            const courseValues = {...course.raw};
            delete courseValues.id;
            delete courseValues.uuid;
            delete courseValues.order_id;
            delete courseValues.line_ids;

            const clonedCourse = this.models["restaurant.order.course"].create({
                ...courseValues,
                order_id: targetOrder,
            });
            clonedCoursesByUuid.set(course.uuid, clonedCourse);
        }
        return clonedCoursesByUuid;
    },

    _cloneBillOrderLines(sourceOrder, targetOrder, clonedCoursesByUuid = new Map()) {
        const clonedLinesByUuid = new Map();

        for (const line of sourceOrder.lines) {
            const lineValues = {...line.raw};
            delete lineValues.id;
            delete lineValues.uuid;
            delete lineValues.order_id;
            delete lineValues.combo_parent_id;
            delete lineValues.combo_line_ids;
            delete lineValues.pack_lot_ids;
            delete lineValues.tax_ids;
            delete lineValues.attribute_value_ids;
            delete lineValues.custom_attribute_value_ids;
            delete lineValues.course_id;

            const clonedLine = this.models["pos.order.line"].create({
                ...lineValues,
                order_id: targetOrder,
                product_id: line.product_id,
                tax_ids: line.tax_ids.map((tax) => ["link", tax]),
                attribute_value_ids: line.attribute_value_ids.map((value) => [
                    "link",
                    value,
                ]),
                custom_attribute_value_ids: line.custom_attribute_value_ids.map(
                    (value) => [
                        "create",
                        {
                            custom_product_template_attribute_value_id:
                                value.custom_product_template_attribute_value_id,
                            custom_value: value.custom_value,
                        },
                    ]
                ),
                pack_lot_ids: line.pack_lot_ids.map((packLot) => [
                    "create",
                    {lot_name: packLot.lot_name},
                ]),
                course_id: line.course_id
                    ? clonedCoursesByUuid.get(line.course_id.uuid) || false
                    : false,
            });
            clonedLinesByUuid.set(line.uuid, clonedLine);
        }

        for (const line of sourceOrder.lines) {
            const clonedLine = clonedLinesByUuid.get(line.uuid);
            if (!clonedLine) {
                continue;
            }

            if (line.combo_parent_id) {
                clonedLine.update({
                    combo_parent_id:
                        clonedLinesByUuid.get(line.combo_parent_id.uuid) || false,
                });
            }

            if (line.combo_line_ids.length) {
                const children = line.combo_line_ids
                    .map((childLine) => clonedLinesByUuid.get(childLine.uuid))
                    .filter(Boolean);
                if (children.length) {
                    clonedLine.update({
                        combo_line_ids: [["link", ...children]],
                    });
                }
            }
        }

        return clonedLinesByUuid;
    },

    _cloneBillPreparationState(sourceOrder, targetOrder, clonedLinesByUuid) {
        const lastChange = sourceOrder.last_order_preparation_change || {};

        targetOrder.last_order_preparation_change = {
            metadata: {...(lastChange.metadata || {})},
            lines: {},
            general_customer_note:
                lastChange.general_customer_note !== undefined
                    ? lastChange.general_customer_note
                    : sourceOrder.general_customer_note || "",
            internal_note:
                lastChange.internal_note !== undefined
                    ? lastChange.internal_note
                    : sourceOrder.internal_note || "",
            sittingMode: lastChange.sittingMode || sourceOrder.preset_id?.id || 0,
        };

        for (const change of Object.values(lastChange.lines || {})) {
            const clonedLine = clonedLinesByUuid.get(change.uuid);
            if (!clonedLine) {
                continue;
            }

            const clonedChange = {
                ...change,
                uuid: clonedLine.uuid,
            };
            if (change.combo_parent_uuid) {
                clonedChange.combo_parent_uuid =
                    clonedLinesByUuid.get(change.combo_parent_uuid)?.uuid ||
                    change.combo_parent_uuid;
            }

            targetOrder.last_order_preparation_change.lines[clonedLine.preparationKey] =
                clonedChange;
        }
    },

    async copyPrintedBillToEditableOrder(order = this.getOrder()) {
        if (!this.isOrderBillLocked(order)) {
            return order;
        }

        const selectedLine = order.getSelectedOrderline();
        const newOrder = this.createNewOrder({
            table_id: order.table_id || false,
        });
        this.addPendingOrder([newOrder.id]);

        newOrder.update({
            partner_id: order.partner_id || false,
            fiscal_position_id: order.fiscal_position_id || false,
            pricelist_id: order.pricelist_id || newOrder.pricelist_id,
            table_id: order.table_id || false,
            customer_count: order.customer_count,
            preset_id: order.preset_id || false,
            preset_time: order.preset_time || false,
            floating_order_name: order.floating_order_name || false,
            general_customer_note: order.general_customer_note || "",
            internal_note: order.internal_note || "",
        });
        newOrder.setBooked(order.uiState?.booked ?? true);

        const clonedCoursesByUuid = this._cloneBillOrderCourses(order, newOrder);
        const clonedLinesByUuid = this._cloneBillOrderLines(
            order,
            newOrder,
            clonedCoursesByUuid
        );
        this._cloneBillPreparationState(order, newOrder, clonedLinesByUuid);

        const clonedSelectedLine =
            selectedLine && clonedLinesByUuid.get(selectedLine.uuid);
        if (clonedSelectedLine) {
            newOrder.selectOrderline(clonedSelectedLine);
        }

        try {
            if (typeof order.id === "number") {
                await this.data.call(
                    "pos.order",
                    "action_pos_order_cancel",
                    [[order.id]],
                    {
                        context: {
                            device_identifier: this.device.identifier,
                        },
                    }
                );
            }
        } catch (error) {
            this.removePendingOrder(newOrder);
            this.data.localDeleteCascade(newOrder);
            this.setOrder(order);
            throw error;
        }

        this.removePendingOrder(order);
        this.data.localDeleteCascade(order);

        if (this.config.module_pos_restaurant && this.computeTableCount) {
            this.computeTableCount();
        }

        await this.syncAllOrders({orders: [newOrder]});
        this.setOrder(newOrder);
        return newOrder;
    },

    async showPopupBlockModify(order = this.getOrder()) {
        const confirmed = await ask(this.dialog, {
            title: _t("Bill Already Printed"),
            body: _t(
                "The bill for this order has already been printed. " +
                    "Do you want to copy this order, cancel the printed bill, " +
                    "and continue editing the new copy?"
            ),
            confirmLabel: _t("Copy and Cancel"),
            cancelLabel: _t("Keep Current Order"),
        });
        if (!confirmed) {
            return false;
        }

        try {
            await this.copyPrintedBillToEditableOrder(order);
            return true;
        } catch (error) {
            console.warn("Unable to copy the printed bill order.", error);
            this.dialog.add(AlertDialog, {
                title: _t("Order Copy Unsuccessful"),
                body: _t(
                    "The printed bill could not be cancelled automatically. " +
                        "No copy was created."
                ),
            });
            return false;
        }
    },
});
