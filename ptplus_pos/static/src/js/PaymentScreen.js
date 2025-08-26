/* Copyright 2016 David Gómez Quilón <david.gomez@aselcis.com>
   Copyright 2018 Tecnativa - David Vidal
   Copyright 2020 Tecnativa - João Marques
   License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
*/

odoo.define("ptplus_pos.PaymentScreen", function (require) {
    "use strict";

    const PaymentScreen = require("point_of_sale.PaymentScreen");
    const Registries = require("point_of_sale.Registries");
    const {isConnectionError} = require("point_of_sale.utils");

    // eslint-disable-next-line no-shadow
    const L10nPtPosPaymentScreen = (PaymentScreen) =>
        class extends PaymentScreen {
            async validateOrder(isForceValidate) {
                // If PT Invoicing is disabled, do nothing.
                if (!this.env.pos.config.l10n_pt_invoicing) {
                    return await super.validateOrder(isForceValidate);
                }

                // Set always is to Invoice
                if (!this.currentOrder.is_to_invoice()) {
                    this.toggleIsToInvoice();
                }

                // Must have lines
                var order_lines = this.currentOrder.get_orderlines();
                if (order_lines.length === 0) {
                    this.showPopup("ErrorPopup", {
                        title: this.env._t("Empty Order"),
                        body: this.env._t(
                            "There must be at least one product in your order before it can be validated"
                        ),
                    });
                    return false;
                }

                // All lines must have one and only one VAT tax defined
                var misconfig_product = "";
                _(order_lines).each(function (line) {
                    var vat_count = 0;
                    _(line.get_taxes()).each(function (tax) {
                        if (tax.l10n_pt_genre === "IVA") ++vat_count;
                    });

                    if (vat_count !== 1) {
                        misconfig_product = line.get_full_product_name();
                    }
                });
                if (misconfig_product !== "") {
                    this.showPopup("ErrorPopup", {
                        title: this.env._t("VAT Error"),
                        body:
                            this.env._t("Product must have one VAT type tax: ") +
                            misconfig_product,
                    });
                    return false;
                }

                // We can't have both negative and positive lines
                // const negative_lines = order_lines
                //     .find(line => line.quantity * line.price < 0);
                // const positive_lines = order_lines
                //     .find(line => line.quantity * line.price > 0);
                // if (positive_lines && negative_lines) {
                //     this.showPopup('ErrorPopup', {
                //         title: this.env._t('Invalid Lines'),
                //         body: this.env._t(
                //             'You can have positive lines (invoice) and negative lines (credit note) but not both'
                //         ),
                //     });
                //     return false;
                // }

                super.validateOrder(isForceValidate);
            }

            async _isOrderValid(isForceValidate) {
                if (!this.env.pos.config.l10n_pt_invoicing) {
                    return await this._super(isForceValidate);
                }

                if (
                    this.currentOrder.get_orderlines().length === 0 &&
                    this.currentOrder.is_to_invoice()
                ) {
                    this.showPopup("ErrorPopup", {
                        title: this.env._t("Empty Order"),
                        body: this.env._t(
                            "There must be at least one product in your order before it can be validated and invoiced."
                        ),
                    });
                    return false;
                }

                // //////////////////////////////////////////////////////////////
                // Removed check for customer selection on every order.
                // Implemented a default partner setting to handle orders without an
                // explicit customer, enhancing the user experience by not requiring
                // a partner selection for each order.
                //
                // Made by Exo Software

                // const splitPayments = this.paymentLines.filter(payment => payment.payment_method.split_transactions)
                // if (splitPayments.length && !this.currentOrder.get_partner()) {
                //     const paymentMethod = splitPayments[0].payment_method
                //     const { confirmed } = await this.showPopup('ConfirmPopup', {
                //         title: this.env._t('Customer Required'),
                //         body: _.str.sprintf(this.env._t('Customer is required for %s payment method.'), paymentMethod.name),
                //     });
                //     if (confirmed) {
                //         this.selectPartner();
                //     }
                //     return false;
                // }

                //
                // //////////////////////////////////////////////////////////////

                // This is to prevent the user from selecting multiple prodructs
                // when is refunding from different orders, only can refund products
                // from the same order

                const line_ids = [];
                const get_orderlines = this.currentOrder.get_orderlines();

                for (var i = 0; i < get_orderlines.length; i++) {
                    if (get_orderlines[i].refunded_orderline_id) {
                        line_ids.push(get_orderlines[i].refunded_orderline_id);
                    }
                }

                const order_ids = await this.env.services.rpc({
                    model: "pos.order",
                    method: "check_same_order_ids",
                    args: [[], line_ids],
                });

                if (order_ids.length > 1) {
                    this.showNotification(
                        this.env._t("Cannot refund products from different orders.")
                    );
                    return false;
                }

                // //////////////////////////////////////////////////////////////
                // Removed check for customer selection on every order.
                // Implemented a default partner setting to handle orders without an
                // explicit customer, enhancing the user experience by not requiring
                // a partner selection for each order.
                //
                // Made by Exo Software
                //
                // Oiginal Code:
                //
                // if ((this.currentOrder.is_to_invoice() || this.currentOrder.is_to_ship()) && !this.currentOrder.get_partner()) {
                //     const { confirmed } = await this.showPopup('ConfirmPopup', {
                //         title: this.env._t('Please select the Customer'),
                //         body: this.env._t(
                //             'You need to select the customer before you can invoice or ship an order.'
                //         ),
                //     });
                //     if (confirmed) {
                //         this.selectPartner();
                //     }
                //     return false;
                // }
                // //////////////////////////////////////////////////////////////

                const partner = this.currentOrder.get_partner();
                if (
                    this.currentOrder.is_to_ship() &&
                    !(
                        partner.name &&
                        partner.street &&
                        partner.city &&
                        partner.country_id
                    )
                ) {
                    this.showPopup("ErrorPopup", {
                        title: this.env._t("Incorrect address for shipping"),
                        body: this.env._t("The selected customer needs an address."),
                    });
                    return false;
                }

                if (
                    this.currentOrder.get_total_with_tax() !== 0 &&
                    this.currentOrder.get_paymentlines().length === 0
                ) {
                    this.showNotification(
                        this.env._t("Select a payment method to validate the order.")
                    );
                    return false;
                }

                if (!this.currentOrder.is_paid() || this.invoicing) {
                    return false;
                }

                if (this.currentOrder.has_not_valid_rounding()) {
                    var line = this.currentOrder.has_not_valid_rounding();
                    this.showPopup("ErrorPopup", {
                        title: this.env._t("Incorrect rounding"),
                        body: this.env._t(
                            "You have to round your payments lines." +
                                line.amount +
                                " is not rounded."
                        ),
                    });
                    return false;
                }

                // The exact amount must be paid if there is no cash payment method defined.
                if (
                    Math.abs(
                        this.currentOrder.get_total_with_tax() -
                            this.currentOrder.get_total_paid() +
                            this.currentOrder.get_rounding_applied()
                    ) > 0.00001
                ) {
                    var cash = false;
                    for (var i = 0; i < this.env.pos.payment_methods.length; i++) {
                        cash = cash || this.env.pos.payment_methods[i].is_cash_count;
                    }
                    if (!cash) {
                        this.showPopup("ErrorPopup", {
                            title: this.env._t(
                                "Cannot return change without a cash payment method"
                            ),
                            body: this.env._t(
                                "There is no cash payment method available in this point of sale to handle the change.\n\n Please pay the exact amount or add a cash payment method in the point of sale configuration"
                            ),
                        });
                        return false;
                    }
                }

                // If the change is too large, it's probably an input error, make the user confirm.
                if (
                    !isForceValidate &&
                    this.currentOrder.get_total_with_tax() > 0 &&
                    this.currentOrder.get_total_with_tax() * 1000 <
                        this.currentOrder.get_total_paid()
                ) {
                    this.showPopup("ConfirmPopup", {
                        title: this.env._t("Please Confirm Large Amount"),
                        body:
                            this.env._t(
                                "Are you sure that the customer wants to  pay"
                            ) +
                            " " +
                            this.env.pos.format_currency(
                                this.currentOrder.get_total_paid()
                            ) +
                            " " +
                            this.env._t("for an order of") +
                            " " +
                            this.env.pos.format_currency(
                                this.currentOrder.get_total_with_tax()
                            ) +
                            " " +
                            this.env._t(
                                '? Clicking "Confirm" will validate the payment.'
                            ),
                    }).then(({confirmed}) => {
                        if (confirmed) this.validateOrder(true);
                    });
                    return false;
                }

                if (!this.currentOrder._isValidEmptyOrder()) return false;

                return true;
            }

            // //////////////////////////////////////////////////////////////
            // This method overrides the default implementation
            // Made by Exo Software
            async _finalizeValidation() {
                if (
                    (this.currentOrder.is_paid_with_cash() ||
                        this.currentOrder.get_change()) &&
                    this.env.pos.config.iface_cashdrawer
                ) {
                    this.env.proxy.printer.open_cashbox();
                }

                this.currentOrder.initialize_validation_date();
                this.currentOrder.finalized = true;

                let syncOrderResult, hasError;

                try {
                    // 1. Save order to server.
                    syncOrderResult = await this.env.pos.push_single_order(
                        this.currentOrder
                    );

                    // 2. Invoice.
                    if (this.currentOrder.is_to_invoice()) {
                        if (syncOrderResult.length) {
                            await this.env.legacyActionManager.do_action(
                                "account.account_invoices",
                                {
                                    additional_context: {
                                        active_ids: [syncOrderResult[0].account_move],
                                    },
                                }
                            );
                            this.currentOrder.l10n_pt_move_data = eval(
                                `(${syncOrderResult[0].l10n_pt_move_data})`
                            );
                            // Console.log(syncOrderResult[0])
                        } else {
                            throw {
                                code: 401,
                                message: "Backend Invoice",
                                data: {order: this.currentOrder},
                            };
                        }
                    }

                    // 3. Post process.
                    if (
                        syncOrderResult.length &&
                        this.currentOrder.wait_for_push_order()
                    ) {
                        const postPushResult = await this._postPushOrderResolve(
                            this.currentOrder,
                            syncOrderResult.map((res) => res.id)
                        );
                        if (!postPushResult) {
                            this.showPopup("ErrorPopup", {
                                title: this.env._t("Error: no internet connection."),
                                body: this.env._t(
                                    "Some, if not all, post-processing after syncing order failed."
                                ),
                            });
                        }
                    }
                } catch (error) {
                    if (error.code === 700 || error.code === 701) this.error = true;

                    if ("code" in error) {
                        // We started putting `code` in the rejected object for invoicing error.
                        // We can continue with that convention such that when the error has `code`,
                        // then it is an error when invoicing. Besides, _handlePushOrderError was
                        // introduce to handle invoicing error logic.
                        await this._handlePushOrderError(error);
                    } else {
                        // We don't block for connection error. But we rethrow for any other errors.
                        if (isConnectionError(error)) {
                            this.showPopup("OfflineErrorPopup", {
                                title: this.env._t("Connection Error"),
                                body: this.env._t(
                                    "Order is not synced. Check your internet connection"
                                ),
                            });
                        } else {
                            throw error;
                        }
                    }
                } finally {
                    // Always show the next screen regardless of error since pos has to
                    // continue working even offline.
                    this.showScreen(this.nextScreen);
                    // Remove the order from the local storage so that when we refresh the page, the order
                    // won't be there
                    this.env.pos.db.remove_unpaid_order(this.currentOrder);

                    // Ask the user to sync the remaining unsynced orders.
                    if (
                        !hasError &&
                        syncOrderResult &&
                        this.env.pos.db.get_orders().length
                    ) {
                        const {confirmed} = await this.showPopup("ConfirmPopup", {
                            title: this.env._t("Remaining unsynced orders"),
                            body: this.env._t(
                                "There are unsynced orders. Do you want to sync these orders?"
                            ),
                        });
                        if (confirmed) {
                            // NOTE: Not yet sure if this should be awaited or not.
                            // If awaited, some operations like changing screen
                            // might not work.
                            this.env.pos.push_orders();
                        }
                    }
                }
            }

            // End of override
            // //////////////////////////////////////////////////////////////
        };

    Registries.Component.extend(PaymentScreen, L10nPtPosPaymentScreen);

    return PaymentScreen;
});
