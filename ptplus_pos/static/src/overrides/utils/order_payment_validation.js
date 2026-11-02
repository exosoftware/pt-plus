import {_t} from "@web/core/l10n/translation";
import {patch} from "@web/core/utils/patch";
import {AlertDialog} from "@web/core/confirmation_dialog/confirmation_dialog";
import OrderPaymentValidation from "@point_of_sale/app/utils/order_payment_validation";

patch(OrderPaymentValidation.prototype, {
    async askBeforeValidation() {
        if (!this.pos.config.l10n_pt_invoicing) {
            return await super.askBeforeValidation(...arguments);
        }

        // The invoice is issued by the server, it can't be done offline
        if (this.pos.data.network.offline) {
            this.pos.dialog.add(AlertDialog, {
                title: _t("No connection"),
                body: _t(
                    "The invoice can't be issued without a connection to the server."
                ),
            });
            return false;
        }

        const misconfiguredProduct = this.l10nPtFindMisconfiguredProduct();
        if (misconfiguredProduct) {
            this.pos.dialog.add(AlertDialog, {
                title: _t("VAT Error"),
                body: _t("Product must have one VAT type tax: ") + misconfiguredProduct,
            });
            return false;
        }

        const defaultPartner = this.pos.config.l10n_pt_default_partner_id;
        if (defaultPartner && !this.order.getPartner()) {
            this.order.setPartner(defaultPartner);
        }
        this.order.setToInvoice(true);

        return await super.askBeforeValidation(...arguments);
    },

    l10nPtFindMisconfiguredProduct() {
        const lines = this.order
            .getOrderlines()
            .filter((line) => line.combo_line_ids.length === 0);
        for (const line of lines) {
            const vatCount = line.tax_ids.filter(
                (tax) => tax.l10n_pt_genre === "IVA"
            ).length;
            if (vatCount !== 1) {
                return line.getFullProductName();
            }
        }
        return null;
    },

    shouldDownloadInvoice() {
        if (this.pos.config.l10n_pt_invoicing) {
            return false;
        }
        return super.shouldDownloadInvoice(...arguments);
    },

    get canPrintReceipt() {
        // A receipt without the invoice data (e.g. lost connection) is not a
        // valid fiscal document
        if (this.pos.config.l10n_pt_invoicing && !this.order.l10n_pt_doc_name) {
            return false;
        }
        return super.canPrintReceipt;
    },
});
