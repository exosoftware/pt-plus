/* Copyright 2016 David Gómez Quilón <david.gomez@aselcis.com>
   Copyright 2018 Tecnativa - David Vidal
   Copyright 2020 Tecnativa - João Marques
   License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
*/

odoo.define("ptplus_pos.PaymentScreen", function (require) {
    "use strict";

    const PaymentScreen = require("point_of_sale.PaymentScreen");
    const Registries = require("point_of_sale.Registries");

    const L10nPtPosPaymentScreen = (PaymentScreen) =>
        class extends PaymentScreen {
            async validateOrder(isForceValidate) {
                // If PT Invoicing is disabled, do nothing. Also do nothing if
                // a backend invoice is desired
                if (!this.env.pos.config.pt_invoicing || this.currentOrder.to_invoice) {
                    super.validateOrder(isForceValidate);
                    return;
                }

                // Invoices over 1000 € need a customer
                var needs_customer =
                    this.currentOrder.get_total_with_tax() >= 1000;
                if (needs_customer && !this.currentOrder.get_client()) {
                    const { confirmed } = await this.showPopup('ConfirmPopup', {
                        title: this.env._t('Please select the Customer'),
                        body: this.env._t(
                            'Invoice exceeds 1000€. You need to select a customer.'
                        ),
                    });
                    if (confirmed) {
                        this.selectClient();
                    }
                    return false;
                }

                // Must have lines
                var order_lines = this.currentOrder.get_orderlines();
                if (order_lines.length === 0) {
                    this.showPopup('ErrorPopup', {
                        title: this.env._t('Empty Order'),
                        body: this.env._t(
                            'There must be at least one product in your order before it can be validated'
                        ),
                    });
                    return false;
                }

                // All lines must have one and only one VAT tax defined
                var misconfig_product = '';
                _(order_lines).each(function (line) {
                    var vat_count = 0;
                    _(line.get_taxes()).each(function(tax){
                        if (tax.l10n_pt_genre === 'IVA')
                            ++vat_count;
                    });

                    if (vat_count != 1) {
                        misconfig_product = line.get_full_product_name();
                    }
                });

                if (misconfig_product != '') {
                    this.showPopup('ErrorPopup', {
                        title: this.env._t('VAT Error'),
                        body: this.env._t(
                            'Product must have one VAT type tax: '
                        ) + misconfig_product,
                    });
                    return false;
                }

                // We can't have both negative and positive lines
                const negative_lines = order_lines
                    .find(line => line.quantity * line.price < 0);
                const positive_lines = order_lines
                    .find(line => line.quantity * line.price > 0);
                if (positive_lines && negative_lines) {
                    this.showPopup('ErrorPopup', {
                        title: this.env._t('Invalid Lines'),
                        body: this.env._t(
                            'You can have positive lines (invoice) and negative lines (credit note) but not both'
                        ),
                    });
                    return false;
                }

                // On positive lines, we'll issue an invoice. On negative
                // lines, we'll issue a credit note
                if (positive_lines) {
                    this.currentOrder.pt_issue_invoice();
                }
                else {
                    this.currentOrder.pt_issue_credit_note();
                }

                super.validateOrder(isForceValidate);
            }
        };

    Registries.Component.extend(PaymentScreen, L10nPtPosPaymentScreen);

    return PaymentScreen;
});
