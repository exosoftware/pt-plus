odoo.define("ptplus_pos.ProductScreen", function (require) {
    "use strict";

    const ProductScreen = require("point_of_sale.ProductScreen");
    const Registries = require("point_of_sale.Registries");
    const PtplusPosMixin = require("ptplus_pos.PtplusPosMixin");

    const L10nPtPosProductScreen = (ProductScreen) =>
        class extends ProductScreen {
            async _clickProduct(event) {
                // If PT Invoicing is disabled, do nothing.
                if (
                    !this.env.pos.config.l10n_pt_invoicing ||
                    !this.currentOrder.l10n_pt_bill_last_hash
                ) {
                    return await super._clickProduct(event);
                }

                await PtplusPosMixin.showPopupBlockOrder(this, event);
            }

            async _updateSelectedOrderline(event) {
                if (
                    !this.env.pos.config.l10n_pt_invoicing ||
                    !this.currentOrder.l10n_pt_bill_last_hash
                ) {
                    return await super._updateSelectedOrderline(event);
                }

                await PtplusPosMixin.showPopupBlockOrder(this, event);
            }
        };

    Registries.Component.extend(ProductScreen, L10nPtPosProductScreen);

    return ProductScreen;
});
