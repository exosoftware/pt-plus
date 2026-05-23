/** @odoo-module */
import {patch} from "@web/core/utils/patch";
import {Order} from "@point_of_sale/app/store/models";

patch(Order.prototype, {
    setup(_defaultObj, options) {
        super.setup(...arguments);
        // It is possible that this orderline is initialized using `init_from_JSON`,
        // meaning, it is loaded from localStorage or from export_for_ui. This means
        // that some fields has already been assigned. Therefore, we only set the options
        // when the original value is falsy.
        if (this.pos.config.l10n_pt_invoicing) {
            this.l10n_pt_unique_id =
                this.l10n_pt_unique_id || options.l10n_pt_unique_id;
            this.l10n_pt_doc_name = this.l10n_pt_doc_name || options.l10n_pt_doc_name;
            this.l10n_pt_qr_code = this.l10n_pt_qr_code || options.l10n_pt_qr_code;
            this.l10n_pt_atcud = this.l10n_pt_atcud || options.l10n_pt_atcud;
            this.l10n_pt_certification_text =
                this.l10n_pt_certification_text || options.l10n_pt_certification_text;
        }
    },

    wait_for_push_order() {
        return this.pos.config.l10n_pt_invoicing
            ? true
            : super.wait_for_push_order(...arguments);
    },

    init_from_JSON(json) {
        super.init_from_JSON(...arguments);
        if (this.pos.config.l10n_pt_invoicing) {
            this.l10n_pt_unique_id = json.l10n_pt_unique_id || false;
            this.l10n_pt_doc_name = json.l10n_pt_doc_name || false;
            this.l10n_pt_qr_code =
                json.l10n_pt_qr_code && json.l10n_pt_qr_code.length > 0
                    ? json.l10n_pt_qr_code[0]
                    : false;
            this.l10n_pt_atcud = json.l10n_pt_atcud || false;
            this.l10n_pt_certification_text = json.l10n_pt_certification_text || false;
        }
    },

    export_as_JSON() {
        const json = super.export_as_JSON(...arguments);
        if (this.pos.config.l10n_pt_invoicing) {
            json.l10n_pt_unique_id = this.l10n_pt_unique_id;
        }
        return json;
    },
    export_for_printing() {
        const result = super.export_for_printing(...arguments);
        if (this.pos.config.l10n_pt_invoicing && (this.finalized || this.locked)) {
            result.l10n_pt_unique_id = this.l10n_pt_unique_id;
            result.l10n_pt_doc_name = this.l10n_pt_doc_name;
            result.l10n_pt_qr_code = this.l10n_pt_generateQRCode(this.l10n_pt_qr_code);
            result.l10n_pt_atcud = this.l10n_pt_atcud;
            result.l10n_pt_certification_text = this.l10n_pt_certification_text;
        }
        return result;
    },

    l10n_pt_generateQRCode(qrCodeData) {
        const codeWriter = new window.ZXing.BrowserQRCodeSvgWriter();
        const qrCodeSvg = new XMLSerializer().serializeToString(
            codeWriter.write(qrCodeData, 150, 150)
        );
        return "data:image/svg+xml;base64," + window.btoa(qrCodeSvg);
    },
});
