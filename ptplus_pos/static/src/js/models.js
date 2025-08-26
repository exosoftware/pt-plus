// Copyright 2021 Exo Software - Pedro Castro Silva

// Paste your JavaScript code here: https://obfuscator.io/
function hexToBase64(hex_string) {
    return btoa(
        hex_string
            .match(/\w{2}/g)
            .map(function (a) {
                return String.fromCharCode(parseInt(a, 16));
            })
            .join("")
    );
}

function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}

function dragonUnscramble(str) {
    const offset = 32;
    const dragon_list = [1, 8, 9, 3];
    for (i in dragon_list) {
        var index = dragon_list[i];
        var pos = offset + index;
        var repl = String.fromCharCode(str[pos].charCodeAt(0) - index);
        str = setCharAt(str, pos, repl);
    }
    idx = str.length - 35 - 3;
    str = str.slice(0, idx) + str.slice(idx + 3);
    return str;
}

function get_pt_hash(msg, priv_key) {
    var rsa = new RSAKey();
    priv_key = dragonUnscramble(priv_key);
    rsa.readPrivateKeyFromPEMString(priv_key);
    var hexSig = rsa.sign(msg, "sha1");
    return hexToBase64(hexSig);
}

odoo.define("ptplus_pos.models", function (require) {
    "use strict";

    const {PosGlobalState, Order} = require("point_of_sale.models");
    const Registries = require("point_of_sale.Registries");

    const L10NPTGlobalState = (PosGlobalState) =>
        class L10NPTGlobalState extends PosGlobalState {
            constructor() {
                super(...arguments);
                this.pushed_pt_docs = [];
            }

            pt_get_bill_next_number() {
                if (this.pushed_pt_docs.indexOf(this.config.l10n_pt_bill_next) > -1) {
                    ++this.config.l10n_pt_bill_next;
                }
                return (
                    this.config.l10n_pt_bill_prefix +
                    this.pt_get_padding(this.config.l10n_pt_bill_next, false)
                );
            }

            pt_get_padding(number) {
                var diff = this.config.l10n_pt_bill_padding - number.toString().length;

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
            }

            pt_push_document(order) {
                // To increase client-side sequencing of bills
                // this.pushed_pt_docs.push(order.data.ptplus_unique_id);
                // ++this.config.l10n_pt_bill_next;
                if (
                    this.pushed_pt_docs.indexOf(
                        order.data.l10n_pt_bill_ptplus_unique_id
                    ) === -1
                ) {
                    this.pushed_pt_docs.push(order.data.l10n_pt_bill_ptplus_unique_id);
                    ++this.config.l10n_pt_bill_next;
                }
            }

            _flush_orders(orders) {
                var self = this;
                // Save bill order numbers
                _.each(orders, function (order) {
                    if (order.data.l10n_pt_bill_last_hash) {
                        self.pt_push_document(order);
                    }
                });
                return super._flush_orders(...arguments);
            }
        };
    Registries.Model.extend(PosGlobalState, L10NPTGlobalState);

    const L10NPTOrder = (Order) =>
        class L10NPTOrder extends Order {
            pt_calc_hash(lastHash) {
                this.l10n_pt_bill_hash_control =
                    this.pos.config.l10n_pt_cert_priv_key_version;

                // Compute hashing message and sign it.
                if (!this.pos.config.l10n_pt_cert_priv_key) {
                    this.l10n_pt_bill_hash = "*".repeat(172);
                    return;
                }

                var utc_datetime = this.creation_date.toISOString();
                var msg =
                    utc_datetime.substring(0, 10) +
                    ";" +
                    utc_datetime.substring(0, 19) +
                    ";" +
                    this.name +
                    ";" +
                    this.get_total_with_tax().toFixed(2).toString() +
                    ";" +
                    lastHash;

                // Sign the document
                this.l10n_pt_bill_hash = get_pt_hash(
                    msg,
                    this.pos.config.l10n_pt_cert_priv_key
                );
            }

            pt_bill() {
                this.pt_fiscal_doc_type_id =
                    this.pos.config.l10n_pt_bill_fiscal_doc_type_id[0];
                this.l10n_pt_bill_ptplus_unique_id = this.pos.pt_get_bill_next_number();

                // Compute and save the invoice hash
                const lastHash = this.pos.config.l10n_pt_bill_last_hash || "";
                this.pt_calc_hash(lastHash);
                this.pos.config.l10n_pt_bill_last_hash = this.l10n_pt_bill_hash;
                this.l10n_pt_bill_last_hash = this.l10n_pt_bill_hash;
                this.l10n_pt_bill_atcud = this.pt_get_atcud();
                this.l10n_pt_bill_system_entry_date = moment().toISOString();
            }
            get_base_by_tax() {
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
            }

            pt_get_qrcode(company_vat, tax_details) {
                // Partner: NIF and Country Code
                let partner_vat = "999999990";
                let country_code = "PT";
                const partner = this.get_partner();
                if (partner) {
                    partner_vat = partner.vat ? partner.vat : "999999990";
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
                const doc_type = "CM";
                let doc_number;
                if (this.l10n_ptplus_unique_id) {
                    this.l10n_ptplus_unique_id.slice(0, 2);
                    doc_number = this.l10n_ptplus_unique_id;
                } else {
                    this.l10n_pt_bill_ptplus_unique_id.slice(0, 2);
                    doc_number = this.l10n_pt_bill_ptplus_unique_id;
                }
                const doc_status = "N"; // May change in the future
                const doc_date = this.creation_date
                    .toISOString()
                    .replace(/-/g, "")
                    .substring(0, 8);

                // VAT summary block
                // Report tax base and tax amount for every tax type on every tax region included
                // in the document. Some exceptions apply:
                // - for tax type ISE we only report tax base
                // - on non-national regions we must indicate the customer country code instead of region code
                const vat_details = tax_details.filter(
                    (tax_detail) => tax_detail.tax.l10n_pt_genre == "IVA"
                );
                let vat_summary = "";
                const prefixes = ["K", "J", "I"];
                const tax_regions = ["PT", "PT-AC", "PT-MA", "INTRA", "EXTRA"];
                for (const tax_region of tax_regions) {
                    const region_details = vat_details.filter(
                        (vat_detail) =>
                            vat_detail.tax.pt_vat_country_region == tax_region
                    );
                    if (region_details.length > 0) {
                        const prefix = prefixes.pop();
                        let region_summary = `${prefix}1${
                            ["INTRA", "EXTRA"].includes(tax_region)
                                ? country_code
                                : tax_region
                        }*`;
                        let tax_type_idx = 2;
                        for (const tax_type of ["ISE", "RED", "INT", "NOR"]) {
                            const tax_type_details = region_details.filter(
                                (region_detail) =>
                                    region_detail.tax.pt_vat_tax_type == tax_type
                            );
                            if (tax_type_details.length > 0) {
                                for (const tax_type_detail of tax_type_details) {
                                    const base_amount = Math.abs(
                                        tax_type_detail.base
                                    ).toFixed(2);
                                    region_summary += `${prefix}${tax_type_idx}:${base_amount}*`;

                                    if (tax_type != "ISE") {
                                        const tax_amount = Math.abs(
                                            tax_type_detail.amount
                                        ).toFixed(2);
                                        region_summary += `${prefix}${
                                            tax_type_idx + 1
                                        }:${tax_amount}*`;
                                    }
                                }
                            }
                            tax_type_idx += tax_type == "ISE" ? 1 : 2;
                        }
                        vat_summary += region_summary;
                    }
                }

                // Tax Totals
                // -----
                const tax_total = Math.abs(this.get_total_tax()).toFixed(2);
                const gross_total = Math.abs(this.get_total_with_tax()).toFixed(2);
                let vat_exempt_amount = 0.0;
                let stamp_duty = 0.0;
                let withholding_tax = 0.0;
                for (const tax_detail of tax_details) {
                    vat_exempt_amount +=
                        tax_detail.tax.l10n_pt_genre == "IVA" &&
                        tax_detail.tax.pt_vat_tax_type == "ISE"
                            ? tax_detail.base
                            : 0.0;
                    stamp_duty +=
                        tax_detail.tax.l10n_pt_genre == "IS" ? tax_detail.amount : 0.0;
                    withholding_tax +=
                        tax_detail.tax.l10n_pt_genre == "RF" ? tax_detail.amount : 0.0;
                }
                vat_exempt_amount = Math.abs(vat_exempt_amount).toFixed(2);
                stamp_duty = Math.abs(stamp_duty).toFixed(2);
                withholding_tax = Math.abs(withholding_tax).toFixed(2);

                // Final stuff
                const hash_sample = this.pt_get_hash_sample();
                const cert_code = this.pos.config.l10n_pt_cert_code;

                // Render the QR Code contents
                let qrcode = `A:${company_vat}*B:${partner_vat}*C:${country_code}*D:${doc_type}*`;
                qrcode += `E:${doc_status}*F:${doc_date}*G:${doc_number}*H:${this.l10n_pt_bill_atcud}*`;
                qrcode += vat_summary;
                qrcode += `L:${vat_exempt_amount}*M:${stamp_duty}*N:${tax_total}*O:${gross_total}*`;
                qrcode += `P:${withholding_tax}*Q:${hash_sample}*R:${cert_code}*`;
                return qrcode;
            }

            generateQRCode(qrCodeData) {
                const codeWriter = new window.ZXing.BrowserQRCodeSvgWriter();
                const hints = new Map();
                hints.set(window.ZXing.EncodeHintType.CHARACTER_SET, "UTF-8");
                // Hints.set(window.ZXing.EncodeHintType.QR_VERSION, 10); // 10 is already the default
                // hints.set(window.ZXing.EncodeHintType.ERROR_CORRECTION, window.ZXing.ErrorCorrectionLevel.H);
                const qrCodeSvg = new XMLSerializer().serializeToString(
                    codeWriter.write(qrCodeData, 300, 300, hints)
                );
                return "data:image/svg+xml;base64," + window.btoa(qrCodeSvg);
            }

            pt_get_atcud() {
                const validation_code = this.pos.config.l10n_pt_bill_validation_code;
                const serial_number = this.l10n_pt_bill_ptplus_unique_id.split("/")[1];

                return `${validation_code}-${serial_number}`;
            }

            pt_get_hash_sample() {
                var hash_sample = "****";

                if (this.l10n_pt_bill_hash && this.l10n_pt_bill_hash.length > 30) {
                    hash_sample =
                        this.l10n_pt_bill_hash[0] +
                        this.l10n_pt_bill_hash[10] +
                        this.l10n_pt_bill_hash[20] +
                        this.l10n_pt_bill_hash[30];
                }
                return hash_sample;
            }

            pt_get_certification_text() {
                var txt =
                    this.pt_get_hash_sample() +
                    "-Processado por programa certificado nº " +
                    this.pos.config.l10n_pt_cert_code +
                    "/AT";
                return txt;
            }

            init_from_JSON(json) {
                super.init_from_JSON(...arguments);
                this.to_invoice = json.to_invoice;
                this.l10n_ptplus_unique_id = json.l10n_ptplus_unique_id;
                this.pt_hash_control = json.pt_hash_control;
                this.pt_hash = json.pt_hash;
                this.pt_atcud = json.pt_atcud;
                this.pt_inv_last_hash = json.pt_inv_last_hash;
                this.l10n_pt_inv_fiscal_doc_type_id =
                    json.l10n_pt_inv_fiscal_doc_type_id;
                this.l10n_pt_cred_fiscal_doc_type_id =
                    json.l10n_pt_cred_fiscal_doc_type_id;
                this.pt_fiscal_doc_type_id = json.pt_fiscal_doc_type_id;
                this.l10n_pt_move_data = json.l10n_pt_move_data;
                this.l10n_pt_doc_name = json.l10n_pt_doc_name;
                this.l10n_pt_qr_code = json.l10n_pt_qr_code;
                this.l10n_pt_certification_text = json.l10n_pt_certification_text;
                // Bill data
                this.l10n_pt_bill_ptplus_unique_id = json.l10n_pt_bill_ptplus_unique_id;
                this.l10n_pt_bill_hash = json.l10n_pt_bill_hash;
                this.l10n_pt_bill_hash_control = json.l10n_pt_bill_hash_control;
                this.l10n_pt_bill_last_hash = json.l10n_pt_bill_last_hash;
                this.l10n_pt_bill_atcud = json.l10n_pt_bill_atcud;
                this.l10n_pt_bill_system_entry_date =
                    json.l10n_pt_bill_system_entry_date;
                this.l10n_pt_bill_qr_code = json.l10n_pt_bill_qr_code;
            }
            export_as_JSON() {
                const json = super.export_as_JSON(...arguments);
                json.l10n_ptplus_unique_id = this.l10n_ptplus_unique_id;
                json.pt_hash_control = this.pt_hash_control;
                json.pt_hash = this.pt_hash;
                json.pt_atcud = this.pt_atcud;
                json.pt_fiscal_doc_type_id = this.pt_fiscal_doc_type_id;
                // Bill data
                json.l10n_pt_bill_ptplus_unique_id = this.l10n_pt_bill_ptplus_unique_id;
                json.l10n_pt_bill_hash = this.l10n_pt_bill_hash;
                json.l10n_pt_bill_hash_control = this.l10n_pt_bill_hash_control;
                json.l10n_pt_bill_atcud = this.l10n_pt_bill_atcud;
                json.l10n_pt_bill_last_hash = this.l10n_pt_bill_last_hash;
                json.l10n_pt_bill_system_entry_date =
                    this.l10n_pt_bill_system_entry_date;
                json.l10n_pt_bill_qr_code = this.l10n_pt_bill_qr_code;

                return json;
            }

            export_for_printing() {
                const result = super.export_for_printing(...arguments);
                // If is invoice has l10n_pt_move_data, just to force
                if (this.to_invoice && this.l10n_pt_move_data) {
                    // Get the invoice data instead of the PoS
                    this.l10n_ptplus_unique_id =
                        this.l10n_pt_move_data.l10n_ptplus_unique_id;
                    this.pt_hash = this.l10n_pt_move_data.l10n_pt_hash;
                    result.pt_atcud = this.l10n_pt_move_data.l10n_pt_atcud;
                    result.l10n_pt_doc_name = this.l10n_pt_move_data.l10n_pt_doc_name;
                    result.l10n_pt_qr_code = this.l10n_pt_move_data.l10n_pt_qr_code;
                    result.l10n_pt_certification_text =
                        this.l10n_pt_move_data.l10n_pt_certification_text;
                }
                // Normaly this will be executed when is receipt is reprinted
                else if (this.to_invoice && !this.l10n_pt_move_data) {
                    result.pt_atcud = this.pt_atcud;
                    result.pt_hash = this.pt_hash;
                    result.l10n_pt_doc_name = this.l10n_pt_doc_name;
                    result.l10n_pt_certification_text = this.l10n_pt_certification_text;
                    result.l10n_pt_qr_code = this.l10n_pt_qr_code;
                }
                // Not first time printing bill
                // FIXME atcud is not being increment when we print bills from
                //  different orders
                else if (this.l10n_pt_bill_hash) {
                    if (!result.l10n_pt_certification_text) {
                        result.l10n_pt_certification_text =
                            this.pt_get_certification_text();
                    }
                    result.l10n_pt_bill_ptplus_unique_id =
                        this.l10n_pt_bill_ptplus_unique_id;
                    result.l10n_pt_bill_last_hash = this.l10n_pt_bill_last_hash;
                    result.l10n_pt_bill_atcud = this.l10n_pt_bill_atcud;
                    result.l10n_pt_bill_hash = this.l10n_pt_bill_hash;
                    result.l10n_pt_bill_qr_code = this.l10n_pt_bill_qr_code;
                    result.l10n_pt_bill_system_entry_date =
                        this.l10n_pt_bill_system_entry_date;
                }
                // First time printing bill
                else {
                    this.pt_bill();
                    if (!result.l10n_pt_certification_text) {
                        result.l10n_pt_certification_text =
                            this.pt_get_certification_text();
                    }
                    result.l10n_pt_bill_ptplus_unique_id =
                        this.l10n_pt_bill_ptplus_unique_id;
                    result.l10n_pt_bill_last_hash = this.l10n_pt_bill_last_hash;
                    result.l10n_pt_bill_atcud = this.l10n_pt_bill_atcud;
                    result.l10n_pt_bill_hash = this.l10n_pt_bill_hash;
                    this.l10n_pt_bill_qr_code = this.pt_get_qrcode(
                        result.company.vat,
                        result.tax_details
                    );
                    result.l10n_pt_bill_qr_code = this.l10n_pt_bill_qr_code;
                    result.l10n_pt_bill_system_entry_date =
                        this.l10n_pt_bill_system_entry_date;
                }

                result.l10n_ptplus_unique_id = this.l10n_ptplus_unique_id;
                var company = this.pos.company;
                result.company.street = company.street;
                result.company.zip = company.zip;
                result.company.city = company.city;
                result.company.state_id = company.state_id;

                // Remove PT from company VAT number
                result.company.vat = company.vat.replace(/[^0-9]/g, "");

                var base_by_tax = this.get_base_by_tax();
                for (const tax of result.tax_details) {
                    tax.base = base_by_tax[tax.tax.id];
                }

                // Generate QR
                if (result.l10n_pt_qr_code) {
                    result.l10n_pt_qr_code = this.generateQRCode(
                        result.l10n_pt_qr_code
                    );
                } else if (result.l10n_pt_bill_qr_code) {
                    result.l10n_pt_bill_qr_code = this.generateQRCode(
                        result.l10n_pt_bill_qr_code
                    );
                }

                return result;
            }
        };
    Registries.Model.extend(Order, L10NPTOrder);
});
