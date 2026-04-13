odoo.define("ptplus_pos.OrderReceipt", function (require) {
    "use strict";

    const OrderReceipt = require("point_of_sale.OrderReceipt");
    const Registries = require("point_of_sale.Registries");

    const L10nPtPosOrderReceipt = (OrderReceipt) =>
        class extends OrderReceipt {
            get_group_tax_by_name() {
                const taxes = {};
                const displayTaxes = [];

                for (const tax_detail of this.receipt.tax_details) {
                    const key_name = `${tax_detail.tax.tax_group_id[1]} / ${tax_detail.tax.l10n_pt_vat_exemption_reason_text}`;
                    if (!taxes.hasOwnProperty(key_name)) {
                        taxes[key_name] = [
                            tax_detail.tax.tax_group_id[1],
                            tax_detail.amount,
                            tax_detail.tax.pt_vat_exemption_reason,
                        ];
                    } else {
                        taxes[key_name][1] += tax_detail.amount;
                    }
                }
                for (const key in taxes) {
                    // Const displayTax = key.split("/")[0].trim();
                    displayTaxes.push(taxes[key]);
                }
                return displayTaxes;
            }
        };

    Registries.Component.extend(OrderReceipt, L10nPtPosOrderReceipt);

    return OrderReceipt;
});
