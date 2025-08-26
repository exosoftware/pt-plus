odoo.define("dps_pos_cancel_order_history.TicketScreen", function (require) {
    "use strict";

    const TicketScreen = require("point_of_sale.TicketScreen");
    const Registries = require("point_of_sale.Registries");
    const PtplusPosMixin = require("ptplus_pos.PtplusPosMixin");

    const L10nPtPosTicketScreen = (TicketScreen) =>
        class extends TicketScreen {
            async _onDeleteOrder(order) {
                // If PT Invoicing is disabled, do nothing.
                if (
                    !this.env.pos.config.l10n_pt_invoicing ||
                    !this.env.pos.get_order() ||
                    this.env.pos.get_order().l10n_pt_bill_last_hash === null
                ) {
                    return await super._onDeleteOrder(order);
                }

                await PtplusPosMixin.showPopupBlockDelete(this);
            }
        };

    Registries.Component.extend(TicketScreen, L10nPtPosTicketScreen);

    return TicketScreen;
});
