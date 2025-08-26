/** @odoo-module */
import {_t} from "@web/core/l10n/translation";
import {patch} from "@web/core/utils/patch";
import {PaymentScreen} from "@point_of_sale/app/screens/payment_screen/payment_screen";
import {PosStore} from "@point_of_sale/app/store/pos_store";
import {AlertDialog} from "@web/core/confirmation_dialog/confirmation_dialog";
import {onMounted} from "@odoo/owl";

patch(PaymentScreen.prototype, {
    async validateOrder(isForceValidate) {
        // If PT Invoicing is disabled, do nothing.
        if (!this.pos.config.l10n_pt_invoicing) {
            return await super.validateOrder(...arguments);
        }
        // Set default partner
        const default_customer = this.pos.config.l10n_pt_default_partner_id.id;
        const currentPartner = this.currentOrder.get_partner();
        if (default_customer && !currentPartner) {
            this.currentOrder.set_partner(default_customer);
        }

        const misconfiguredProduct = this.findMisconfiguredProduct();
        if (misconfiguredProduct) {
            this.dialog.add(AlertDialog, {
                title: _t("VAT Error"),
                body: _t("Product must have one VAT type tax: ") + misconfiguredProduct,
            });
            return false;
        }
        this.currentOrder.set_to_invoice(true);

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
            (lines) => lines.combo_line_ids.length === 0
        )) {
            const vatCount = line.tax_ids.filter(
                (tax) => tax.l10n_pt_genre === "IVA"
            ).length;
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

    shouldDownloadInvoice() {
        if (this.pos.config.l10n_pt_invoicing) {
            return false;
        } else {
            return super.shouldDownloadInvoice();
        }
    },

    async updateOrderWithPTDetails(order, order_server_ids) {
        const savedOrder = await this.pos.data.searchRead(
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
