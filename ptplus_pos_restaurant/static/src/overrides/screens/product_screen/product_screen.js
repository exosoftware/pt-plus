/** @odoo-module **/

import {ProductScreen} from "@point_of_sale/app/screens/product_screen/product_screen";
import {patch} from "@web/core/utils/patch";

patch(ProductScreen.prototype, {
    async addProductToOrder(product) {
        if (
            !this.pos.config.l10n_pt_invoicing ||
            !this.pos.isOrderBillLocked(this.pos.getOrder())
        ) {
            return super.addProductToOrder(product);
        }

        if (await this.pos.showPopupBlockModify()) {
            return super.addProductToOrder(product);
        }
    },
});
