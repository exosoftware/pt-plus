/** @odoo-module */
import {_t} from "@web/core/l10n/translation";
import {patch} from "@web/core/utils/patch";
import {ErrorPopup} from "@point_of_sale/app/errors/popups/error_popup";
import {PaymentScreen} from "@point_of_sale/app/screens/payment_screen/payment_screen";
import {PosStore} from "@point_of_sale/app/store/pos_store";

patch(PosStore.prototype, {
    isPortugueseCompany() {
        return this.company.country?.code == "PT";
    },
});

patch(PaymentScreen.prototype, {
    async validateOrder(isForceValidate) {
        // If PT Invoicing is disabled, do nothing.
        if (!this.pos.config.l10n_pt_invoicing) {
            return await super.validateOrder(...arguments);
        }

        const misconfiguredProduct = this.findMisconfiguredProduct();
        if (misconfiguredProduct) {
            this.popup.add(ErrorPopup, {
                title: _t("VAT Error"),
                body: _t("Product must have one VAT type tax: ") + misconfiguredProduct,
            });
            return false;
        }

        // if (this.hasInvalidLineCombination()) {
        //     this.popup.add(ErrorPopup, {
        //         title: _t("Invalid Lines"),
        //         body: _t("You can have positive lines (invoice) and negative lines (credit note) but not both"),
        //     });
        //     return false;
        // }

        this.currentOrder.partner =
            this.currentOrder.partner || this.getDefaultPartner();
        this.currentOrder.set_to_invoice(!this.currentOrder.is_to_invoice());

        return await super.validateOrder(isForceValidate);
    },

    async _postPushOrderResolve(order, order_server_ids) {
        if (this.pos.config.l10n_pt_invoicing) {
            await this.updateOrderWithPTDetails(order, order_server_ids);
        }
        return super._postPushOrderResolve(...arguments);
    },

    findMisconfiguredProduct() {
        const orderLines = this.currentOrder.get_orderlines();
        for (const line of orderLines.filter(
            (lines) => !lines.product.type === "combo"
        )) {
            const vatCount = line
                .get_taxes()
                .filter((tax) => tax.l10n_pt_genre === "IVA").length;
            if (vatCount !== 1) {
                return line.get_full_product_name();
            }
        }
        return null;
    },

    hasInvalidLineCombination() {
        const orderLines = this.currentOrder.get_orderlines();
        const hasPositiveLines = orderLines.some(
            (line) => line.quantity * line.price > 0
        );
        const hasNegativeLines = orderLines.some(
            (line) => line.quantity * line.price < 0
        );
        return hasPositiveLines && hasNegativeLines;
    },

    getDefaultPartner() {
        return (
            this.currentOrder.partner ||
            this.pos.db.partner_by_id[this.pos.config.l10n_pt_default_partner_id[0]]
        );
    },

    shouldDownloadInvoice() {
        if (this.pos.config.l10n_pt_invoicing && this.pos.isPortugueseCompany()) {
            return false;
        } else {
            return super.shouldDownloadInvoice();
        }
    },

    async updateOrderWithPTDetails(order, order_server_ids) {
        const savedOrder = await this.orm.searchRead(
            "pos.order",
            [["id", "in", order_server_ids]],
            [
                "l10n_pt_atcud",
                "l10n_pt_certification_text",
                "l10n_pt_doc_name",
                "l10n_pt_qr_code",
                "l10n_pt_unique_id",
            ]
        );
        order.l10n_pt_unique_id = savedOrder[0].l10n_pt_unique_id;
        order.l10n_pt_doc_name = savedOrder[0].l10n_pt_doc_name;
        order.l10n_pt_qr_code = savedOrder[0].l10n_pt_qr_code;
        order.l10n_pt_atcud = savedOrder[0].l10n_pt_atcud;
        order.l10n_pt_certification_text = savedOrder[0].l10n_pt_certification_text;
    },
});
