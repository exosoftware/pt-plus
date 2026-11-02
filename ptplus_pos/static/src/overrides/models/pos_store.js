import {PosStore} from "@point_of_sale/app/services/pos_store";
import {AlertDialog} from "@web/core/confirmation_dialog/confirmation_dialog";
import {ask} from "@point_of_sale/app/utils/make_awaitable_dialog";
import {_t} from "@web/core/l10n/translation";
import {patch} from "@web/core/utils/patch";

patch(PosStore.prototype, {
    isOrderBillLocked(order) {
        return Boolean(order?.l10n_pt_bill_unique_id || order?.l10n_pt_is_bill);
    },

    async onDeleteOrder(order) {
        if (!this.isOrderBillLocked(order)) {
            return await super.onDeleteOrder(...arguments);
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

    async copyPrintedBillToEditableOrder(order = this.getOrder()) {
        if (!this.isOrderBillLocked(order)) {
            return order;
        }

        // The printed bill stays issued as a cancelled document, its lines,
        // courses and kitchen state move to a new order
        await this.data.call("pos.order", "cancel_order_from_pos", [[order.id]], {
            context: {device_identifier: this.device.identifier},
        });

        const newOrder = this.createNewOrder(
            order.table_id ? {table_id: order.table_id} : {}
        );
        newOrder.update({
            partner_id: order.partner_id || false,
            fiscal_position_id: order.fiscal_position_id || false,
            pricelist_id: order.pricelist_id || newOrder.pricelist_id,
            preset_id: order.preset_id || false,
            preset_time: order.preset_time || false,
            floating_order_name: order.floating_order_name || false,
            general_customer_note: order.general_customer_note || "",
            internal_note: order.internal_note || "",
        });
        this.addPendingOrder([newOrder.id]);
        // pos_restaurant also moves the courses
        if (this._mergeOrders) {
            await this._mergeOrders(order, newOrder);
        } else {
            this.l10nPtMoveOrderLines(order, newOrder);
        }

        this.removePendingOrder(order);
        this.data.localDeleteCascade(order);
        await this.syncAllOrders({orders: [newOrder]});
        this.setOrder(newOrder);
        return newOrder;
    },

    l10nPtMoveOrderLines(sourceOrder, destOrder) {
        for (const prepOrder of this.models["pos.prep.order"].filter(
            (prep) => prep.pos_order_id?.uuid === sourceOrder.uuid
        )) {
            prepOrder.pos_order_id = destOrder;
        }
        for (const line of [...sourceOrder.lines]) {
            const values = {...line.raw, order_id: destOrder.id};
            delete values.uuid;
            delete values.id;
            const newLine = this.models["pos.order.line"].create(values, false, true);
            for (const prepLine of line.prep_line_ids) {
                prepLine.pos_order_line_id = newLine;
            }
            line.delete();
        }
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
