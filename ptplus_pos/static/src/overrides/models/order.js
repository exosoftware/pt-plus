/** @odoo-module */
import {patch} from "@web/core/utils/patch";
import {PosOrder} from "@point_of_sale/app/models/pos_order";

patch(PosOrder.prototype, {
    setup(options) {
        super.setup(...arguments);
        if (this.config.l10n_pt_invoicing) {
            this.l10n_pt_unique_id =
                this.l10n_pt_unique_id || options.l10n_pt_unique_id;
            this.l10n_pt_doc_name = this.l10n_pt_doc_name || options.l10n_pt_doc_name;
            this.l10n_pt_qr_code = this.l10n_pt_qr_code || options.l10n_pt_qr_code;
            this.l10n_pt_atcud = this.l10n_pt_atcud || options.l10n_pt_atcud;
            this.l10n_pt_certification_text =
                this.l10n_pt_certification_text || options.l10n_pt_certification_text;
        }
    },

    l10n_pt_generateQRCode(qrCodeData) {
        if (!qrCodeData) {
            return null;
        }
        const codeWriter = new window.ZXing.BrowserQRCodeSvgWriter();
        const qrCodeSvg = new XMLSerializer().serializeToString(
            codeWriter.write(qrCodeData, 150, 150)
        );
        return "data:image/svg+xml;base64," + window.btoa(qrCodeSvg);
    },
});
