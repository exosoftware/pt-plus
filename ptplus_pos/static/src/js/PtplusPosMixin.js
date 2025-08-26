odoo.define("ptplus_pos.PtplusPosMixin", function (require) {
    "use strict";

    const Orderline = require("point_of_sale.Orderline");

    return {
        async showPopupBlockOrder(self, event) {
            const {confirmed} = await self.showPopup("ConfirmPopup", {
                title: self.env._t("Create a new order ?"),
                body: self.env._t(
                    "This operation will duplicate the current order. " +
                        "Please note, once the table information is printed, " +
                        "you will be unable to make any further modifications " +
                        "to this order."
                ),
            });
            if (confirmed) {
                // Get current orderLines
                const orderLines = self.currentOrder.get_orderlines();
                // 1. Save order to server.
                await self.env.pos.push_single_order(self.currentOrder);

                // Remove order from Ui
                self.env.pos.removeOrder(self.currentOrder);

                // Create a new one with the same lines but without bills hash
                // (l10n_pt_bill_last_hash)
                const newOrder = self.env.pos.add_new_order();

                // Fix problem in for cicle
                const copyOfOrderLines = [...orderLines];
                for (let i = 0; i < copyOfOrderLines.length; i++) {
                    newOrder.add_orderline(copyOfOrderLines[i]);
                }
                // Add the last product clicked
                self.trigger("click-product", event.detail);
            }
        },

        async showPopupBlockDelete(self) {
            await self.showPopup("ErrorPopup", {
                title: self.env._t("Order Deletion Unsuccessful"),
                body: self.env._t(
                    "The deletion operation could not be" +
                        " completed because the bill for this order has already " +
                        "been printed."
                ),
            });
        },

        async _reOrder(self) {
            if (!self.props.order && !self.env.pos.get_order()) {
                return;
            }

            const order = self.props.order || self.env.pos.get_order();
            const pos = self.env.pos;
            const partner = order.get_partner();
            const newOrder = pos.add_new_order();
            if (partner) {
                newOrder.set_partner(partner);
            }
            if (order.fiscal_position) {
                newOrder.fiscal_position = order.fiscal_position;
            }
            if (order.pricelist) {
                newOrder.set_pricelist(order.pricelist);
            }
            const lines = order.get_orderlines();
            for (var i = 0; i < lines.length; i++) {
                const line = lines[i];
                const new_line = Orderline.create(
                    {},
                    this._prepareReorderLineVals(self, newOrder, line)
                );
                if (line.pack_lot_lines) {
                    new_line.setPackLotLines({
                        modifiedPackLotLines: [],
                        newPackLotLines: (line.lot_names || []).map((name) => ({
                            lot_name: name,
                        })),
                    });
                }
                new_line.set_unit_price(line.get_unit_price());
                new_line.set_quantity(line.get_quantity());
                new_line.set_discount(line.get_discount());
                newOrder.add_orderline(new_line);
            }
            self.trigger("click-order", newOrder);
        },

        _prepareReorderLineVals(self, order, line) {
            return {
                pos: self.env.pos,
                order: order,
                product: self.env.pos.db.get_product_by_id(line.get_product().id),
                description: line.name,
                price: line.price_unit,
                tax_ids: order.fiscal_position ? undefined : line.tax_id,
                price_manually_set: true,
                customer_note: line.customer_note,
            };
        },
    };
});
