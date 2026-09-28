/** @odoo-module */
import {patch} from "@web/core/utils/patch";
import {PosOrder} from "@point_of_sale/app/models/pos_order";

patch(PosOrder.prototype, {
    setup(options = {}) {
        super.setup(...arguments);
        if (this.config.l10n_pt_invoicing) {
            this.l10n_pt_bill_unique_id =
                this.l10n_pt_bill_unique_id || options.l10n_pt_bill_unique_id;
            this.l10n_pt_bill_doc_name =
                this.l10n_pt_bill_doc_name || options.l10n_pt_bill_doc_name;

            this.l10n_pt_bill_qr_code =
                this.l10n_pt_bill_qr_code || options.l10n_pt_bill_qr_code;
            this.l10n_pt_bill_atcud =
                this.l10n_pt_bill_atcud || options.l10n_pt_bill_atcud;
            this.l10n_pt_bill_certification_text =
                this.l10n_pt_bill_certification_text ||
                options.l10n_pt_bill_certification_text;
            this.l10n_pt_is_bill =
                this.l10n_pt_is_bill || options.l10n_pt_is_bill || false;
            this._l10n_pt_bill_locked =
                this._l10n_pt_bill_locked ||
                Boolean(this.l10n_pt_bill_unique_id || this.l10n_pt_is_bill);
        }
    },
});
