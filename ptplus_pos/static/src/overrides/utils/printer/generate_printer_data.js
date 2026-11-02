/* global QRCode */
import {patch} from "@web/core/utils/patch";
import {generateQRCodeDataUrl} from "@point_of_sale/utils";
import {GeneratePrinterData} from "@point_of_sale/app/utils/printer/generate_printer_data";

// Mirror of pos.order.receipt.order_receipt_generate_data() in Python
patch(GeneratePrinterData.prototype, {
    generateReceiptData() {
        const data = super.generateReceiptData(...arguments);
        if (this.config.l10n_pt_invoicing) {
            // The sale is already invoiced, the customer can't ask for an invoice
            data.conditions.use_self_invoicing = false;
        }
        // Until the order is invoiced, the receipt shows the bill
        if (this.order.l10n_pt_bill_doc_name && !this.order.l10n_pt_doc_name) {
            Object.assign(data.order, {
                l10n_pt_doc_name: this.order.l10n_pt_bill_doc_name,
                l10n_pt_atcud: this.order.l10n_pt_bill_atcud,
                l10n_pt_certification_text: this.order.l10n_pt_bill_certification_text,
            });
        }
        const qrCode = this.order.l10n_pt_qr_code || this.order.l10n_pt_bill_qr_code;
        if (qrCode) {
            data.image.l10n_pt_qr_code = generateQRCodeDataUrl(qrCode, {
                correctLevel: QRCode.CorrectLevel.Q,
            });
        }
        const reasons = this.order.lines
            .flatMap((line) => line.tax_ids)
            .map((tax) => tax.l10n_pt_vat_exemption_reason_text)
            .filter(Boolean);
        data.extra_data.l10n_pt_vat_exemption_reasons = [...new Set(reasons)].sort();
        return data;
    },
});
