odoo.define("ptplus_pos.OrderCancelButton", function (require) {
    "use strict";

    const PosComponent = require("point_of_sale.PosComponent");
    const ProductScreen = require("point_of_sale.ProductScreen");
    const {useListener} = require("@web/core/utils/hooks");
    const Registries = require("point_of_sale.Registries");
    const {Gui} = require("point_of_sale.Gui");

    class OrderCancelButton extends PosComponent {
        setup() {
            super.setup();
            useListener("click", this.onClick);
        }
        async onClick() {
            const order = this.env.pos.get_order();
            const {confirmed} = await this.showPopup("ConfirmPopup", {
                title: this.env._t("Cancel Order"),
                body: this.env._t("Do you want to cancel the current order?"),
            });
            if (confirmed) {
                // 1. Save order to server.
                await this.env.pos.push_single_order(order);
                // Remove order from Ui
                this.env.pos.removeOrder(order);
                // New orders
                this.env.pos.add_new_order();
            }
            return false;
        }
    }
    OrderCancelButton.template = "OrderCancelButton";

    ProductScreen.addControlButton({
        component: OrderCancelButton,
        position: ["after", "SplitBillButton"],
    });

    Registries.Component.add(OrderCancelButton);

    return OrderCancelButton;
});
