// Copyright 2021 Exo Software - Pedro Castro Silva

// Paste your JavaScript code here: https://obfuscator.io/
function hexToBase64(hex_string) {
    return btoa(hex_string.match(/\w{2}/g).map(function(a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

function dragonUnscramble(str) {
    const offset = 32;
    const dragon_list = [1, 8, 9, 3];
    for (i in dragon_list) {
        var index = dragon_list[i];
        var pos = offset + index;
        var repl = String.fromCharCode((str[pos].charCodeAt(0) - index));
        str = setCharAt(str, pos, repl);
    }
    idx = str.length - 35 - 3;
    str = str.slice(0, idx) + str.slice(idx + 3);
    return str;
}

function get_pt_hash(msg, priv_key) {
    var rsa = new RSAKey();
    priv_key = dragonUnscramble(priv_key)
    rsa.readPrivateKeyFromPEMString(priv_key);
    var hexSig = rsa.sign(msg, 'sha1');
    return hexToBase64(hexSig);
}

odoo.define("ptplus_pos.models", function (require) {
    "use strict";

    var core = require("web.core");
    var _t = core._t;

    var models = require("point_of_sale.models");

    var pos_super = models.PosModel.prototype;
    models.PosModel = models.PosModel.extend({
        initialize: function () {
            pos_super.initialize.apply(this, arguments);
            this.pushed_pt_docs = [];
            return this;
        },
        pt_get_inv_next_number: function () {
            if (this.pushed_pt_docs.indexOf(this.config.pt_inv_next) > -1) {
                ++this.config.pt_inv_next;
            }
            return (
                this.config.pt_inv_prefix +
                this.pt_get_padding(this.config.pt_inv_next, false)
            );
        },
        pt_get_cred_next_number: function () {
            if (this.pushed_pt_docs.indexOf(this.config.pt_cred_next) > -1) {
                ++this.config.pt_cred_next;
            }
            return (
                this.config.pt_cred_prefix +
                this.pt_get_padding(this.config.pt_cred_next, true)
            );
        },
        pt_get_padding: function (number, credit_note) {
            var diff = 0;
            if (!credit_note) {
                diff = this.config.pt_inv_padding - number.toString().length;
            }
            else {
                diff = this.config.pt_cred_padding - number.toString().length;
            }
            var result = "";
            if (diff <= 0) {
                result = number;
            } else {
                for (var i = 0; i < diff; i++) {
                    result += "0";
                }
                result += number;
            }
            return result;
        },
        pt_push_document: function (order) {
            if (this.pushed_pt_docs.indexOf(order.data.ptplus_unique_id) === -1) {
                this.pushed_pt_docs.push(order.data.ptplus_unique_id);
                if (order.data.ptplus_unique_id.substring(0, 2) === "NC") {
                    ++this.config.pt_cred_next;
                }
                else {
                    ++this.config.pt_inv_next;
                }
            }
        },
        _flush_orders: function (orders) {
            var self = this;
            // Save pushed orders numbers
            _.each(orders, function (order) {
                if (!order.data.to_invoice && order.data.ptplus_unique_id) {
                    self.pt_push_document(order);
                }
            });
            return pos_super._flush_orders.apply(this, arguments);
        },
    });

    var order_super = models.Order.prototype;
    models.Order = models.Order.extend({
        pt_calc_hash: function (lastHash) {
            this.pt_hash_control = this.pos.config.pt_cert_priv_key_version;

            // Compute hashing message and sign it.
            if (!this.pos.config.pt_cert_priv_key) {
                this.pt_hash = '*'.repeat(172);
                return;
            }

            var utc_datetime = this.creation_date.toISOString();
            var msg =
                utc_datetime.substring(0, 10) + ';' +
                utc_datetime.substring(0, 19) + ';' +
                this.name + ';' +
                this.get_total_with_tax().toFixed(2).toString() + ';' +
                lastHash;

            // Sign the document
            this.pt_hash = get_pt_hash(msg, this.pos.config.pt_cert_priv_key);
        },
        pt_issue_invoice: function () {
            // Get a fiscal document type and number
            this.pt_reversion = false;
            this.pt_fiscal_doc_type_id = this.pos.config.pt_inv_fiscal_doc_type_id[0];
            this.ptplus_unique_id = this.pos.pt_get_inv_next_number();
            //this.name = this.ptplus_unique_id;

            // Compute and save the invoice hash
            const lastHash = this.pos.config.pt_inv_last_hash || '';
            this.pt_calc_hash(lastHash);
            this.pos.config.pt_inv_last_hash = this.pt_hash;
            this.pt_inv_last_hash = this.pt_hash;
            this.pt_atcud = this.pt_get_atcud();
        },
        pt_issue_credit_note: function () {
            // Get a fiscal document type and number
            this.pt_reversion = true;
            this.pt_fiscal_doc_type_id = this.pos.config.pt_cred_fiscal_doc_type_id[0];
            this.ptplus_unique_id = this.pos.pt_get_cred_next_number();
            // this.name = this.ptplus_unique_id;

            // Compute and save the credit note hash
            const lastHash = this.pos.config.pt_cred_last_hash || '';
            this.pt_calc_hash(lastHash);
            this.pos.config.pt_cred_last_hash = this.pt_hash;
            this.pt_cred_last_hash = this.pt_hash;
            this.pt_atcud = this.pt_get_atcud();
        },
        get_base_by_tax: function () {
            var base_by_tax = {};
            this.get_orderlines().forEach(function (line) {
                var tax_detail = line.get_tax_details();
                var base_price = line.get_price_without_tax();
                if (tax_detail) {
                    Object.keys(tax_detail).forEach(function (tax) {
                        if (Object.keys(base_by_tax).includes(tax)) {
                            base_by_tax[tax] += base_price;
                        } else {
                            base_by_tax[tax] = base_price;
                        }
                    });
                }
            });
            return base_by_tax;
        },
        pt_get_qrcode: function (company_vat, tax_details) {

            // Partner: NIF and Country Code
            let partner_vat = "999999990";
            let country_code = "PT";
            const partner = this.pos.get_client();
            if (partner) {
                partner_vat = (partner.vat) ? partner.vat:"999999990";
                if (partner.country_id) {
                    const country = posmodel.countries.find(
                        (country) => country.id === partner.country_id[0]
                    );
                    country_code = country && country.code;
                }
            }

            // Document Info
            // -------------
            // Doc. Status: consider changing it if the doc. state can be cancelled
            const doc_type = this.ptplus_unique_id.slice(0, 2);
            const doc_status = "N";  // May change in the future
            const doc_date = this.creation_date.toISOString().replace(/-/g, '').substring(0, 8);
            const doc_number = this.ptplus_unique_id;

            // VAT summary block
            // Report tax base and tax amount for every tax type on every tax region included
            // in the document. Some exceptions apply:
            // - for tax type ISE we only report tax base
            // - on non-national regions we must indicate the customer country code instead of region code
            const vat_details = tax_details.filter(tax_detail => tax_detail.tax.l10n_pt_genre == 'IVA');
            let vat_summary = ""
            const prefixes = ["K", "J", "I"]
            let tax_regions = ["PT", "PT-AC", "PT-MA", "INTRA", "EXTRA"];
            for (const tax_region of tax_regions) {
                const region_details = vat_details.filter(
                    vat_detail => vat_detail.tax.pt_vat_country_region == tax_region);
                if (region_details.length > 0) {
                    const prefix = prefixes.pop();
                    let region_summary = `${prefix}1${(["INTRA", "EXTRA"].includes(tax_region)) ? country_code : tax_region}*`;
                    let tax_type_idx = 2;
                    for (const tax_type of ["ISE", "RED", "INT", "NOR"]) {
                        const tax_type_details = region_details.filter(
                            region_detail => region_detail.tax.pt_vat_tax_type == tax_type);
                        if (tax_type_details.length > 0) {
                            for (const tax_type_detail of tax_type_details) {
                                const base_amount = Math.abs(tax_type_detail.base).toFixed(2);
                                region_summary += `${prefix}${tax_type_idx}:${base_amount}*`;

                                if (tax_type != "ISE") {
                                    const tax_amount = Math.abs(tax_type_detail.amount).toFixed(2);
                                    region_summary += `${prefix}${tax_type_idx + 1}:${tax_amount}*`;
                                }
                            }
                        }
                        tax_type_idx += (tax_type == "ISE") ? 1: 2;
                    }
                    vat_summary += region_summary;
                }
            }

            // Tax Totals
            // -----
            const tax_total = Math.abs(this.get_total_tax()).toFixed(2);
            const gross_total = Math.abs(this.get_total_with_tax()).toFixed(2);
            let vat_exempt_amount = 0.00;
            let stamp_duty = 0.00;
            let withholding_tax = 0.00;
            for (const tax_detail of tax_details) {
                vat_exempt_amount += (tax_detail.tax.l10n_pt_genre == "IVA" && tax_detail.tax.pt_vat_tax_type == "ISE") ? tax_detail.base : 0.00;
                stamp_duty += (tax_detail.tax.l10n_pt_genre == "IS") ? tax_detail.amount : 0.00;
                withholding_tax += (tax_detail.tax.l10n_pt_genre == "RF") ? tax_detail.amount : 0.00;
            }
            vat_exempt_amount = Math.abs(vat_exempt_amount).toFixed(2)
            stamp_duty = Math.abs(stamp_duty).toFixed(2)
            withholding_tax = Math.abs(withholding_tax).toFixed(2)

            // Final stuff
            const hash_sample = this.pt_get_hash_sample();
            const cert_code = this.pos.config.pt_cert_code;

            // Render the QR Code contents
            let qrcode = `A:${company_vat}*B:${partner_vat}*C:${country_code}*D:${doc_type}*`;
            qrcode += `E:${doc_status}*F:${doc_date}*G:${doc_number}*H:${this.pt_atcud}*`;
            qrcode += vat_summary;
            qrcode += `L:${vat_exempt_amount}*M:${stamp_duty}*N:${tax_total}*O:${gross_total}*`;
            qrcode += `P:${withholding_tax}*Q:${hash_sample}*R:${cert_code}*`;
            return qrcode;
        },
        pt_get_atcud: function () {
            const validation_code = (!this.pt_reversion) ? this.pos.config.pt_inv_validation_code : this.pos.config.pt_cred_validation_code ;
            const serial_number = this.ptplus_unique_id.split("/")[1];
            return `${validation_code}-${serial_number}`;
        },
        pt_get_hash_sample: function () {
            var hash_sample = "****";
            if (this.pt_hash && this.pt_hash.length > 30) {
                hash_sample = this.pt_hash[0] + this.pt_hash[10] +
                    this.pt_hash[20] + this.pt_hash[30];
            }
            return hash_sample;
        },
        pt_get_certification_text: function () {
            var txt = this.pt_get_hash_sample() + "-Processado por programa certificado nº " +
                this.pos.config.pt_cert_code + "/AT";
            return txt;
        },
        init_from_JSON: function (json) {
            order_super.init_from_JSON.apply(this, arguments);
            this.to_invoice = json.to_invoice;
            this.ptplus_unique_id = json.ptplus_unique_id;
            this.pt_hash_control = json.pt_hash_control;
            this.pt_hash = json.pt_hash;
            this.pt_atcud = json.pt_atcud;
            this.pt_inv_last_hash = json.pt_inv_last_hash;
            this.pt_inv_fiscal_doc_type_id = json.pt_inv_fiscal_doc_type_id;
            this.pt_cred_fiscal_doc_type_id = json.pt_cred_fiscal_doc_type_id;
            this.pt_fiscal_doc_type_id = json.pt_fiscal_doc_type_id;;
        },
        export_as_JSON: function () {
            var res = order_super.export_as_JSON.apply(this, arguments);
            res.to_invoice = this.is_to_invoice();
            if (!res.to_invoice) {
                res.ptplus_unique_id = this.ptplus_unique_id;
                res.pt_hash_control = this.pt_hash_control;
                res.pt_hash = this.pt_hash;
                res.pt_inv_last_hash = this.pt_inv_last_hash;
                res.pt_fiscal_doc_type_id = this.pt_fiscal_doc_type_id;
                res.pt_reversion = this.pt_reversion;
                res.pt_atcud = this.pt_atcud;
            }
            return res;
        },
        export_for_printing: function () {
            var result = order_super.export_for_printing.apply(this, arguments);
            if (!this.pt_hash) {
                return result;
            }
            var company = this.pos.company;
            result.ptplus_unique_id = this.ptplus_unique_id;
            result.pt_fiscal_doc_type_id = this.pt_fiscal_doc_type_id;
            result.pt_certification_text = this.pt_get_certification_text();
            result.pt_reversion = this.pt_reversion;
            if (!this.pt_reversion) {
                result.doc_name = _t("Invoice-receipt");
            }
            else {
                result.doc_name = _t("Credit Note");
            }
            result.company.street = company.street;
            result.company.zip = company.zip;
            result.company.city = company.city;
            result.company.state_id = company.state_id;

            // Remove PT from company VAT number
            result.company.vat = company.vat.replace(/[^0-9]/g, '');

            var base_by_tax = this.get_base_by_tax();
            for (const tax of result.tax_details) {
                tax.base = base_by_tax[tax.tax.id];
            }

            //ATCUD and QR code
            result.pt_atcud = this.pt_atcud;
            result.pt_qrcode_text = this.pt_get_qrcode(
                result.company.vat, result.tax_details);

            // ZXing
            const codeWriter = new window.ZXing.BrowserQRCodeSvgWriter();
            const hints = new Map();
            hints.set(window.ZXing.EncodeHintType.CHARACTER_SET, "UTF-8");
            // hints.set(window.ZXing.EncodeHintType.QR_VERSION, 10);  // 10 is already the default
            // hints.set(window.ZXing.EncodeHintType.ERROR_CORRECTION, window.ZXing.ErrorCorrectionLevel.H);
            let pt_qrcode_svg = new XMLSerializer().serializeToString(codeWriter.write(result.pt_qrcode_text, 300, 300, hints));
            result.pt_qrcode = "data:image/svg+xml;base64," + window.btoa(pt_qrcode_svg);
            return result;
        },
    });

    models.load_fields("res.company", ["street", "city", "state_id", "zip"]);
    models.load_fields("account.tax", ["pt_genre", "pt_vat_tax_type", "pt_vat_country_region"]);
});
