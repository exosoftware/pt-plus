/** @odoo-module **/

import {OrderSummary} from "@point_of_sale/app/screens/product_screen/order_summary/order_summary";
import {patch} from "@web/core/utils/patch";

patch(OrderSummary.prototype, {
    async updateSelectedOrderline({buffer, key}) {
        if (
            !this.pos.config.l10n_pt_invoicing ||
            !this.pos.isOrderBillLocked(this.pos.getOrder())
        ) {
            return super.updateSelectedOrderline(...arguments);
        }

        if (await this.pos.showPopupBlockModify()) {
            return super.updateSelectedOrderline(...arguments);
        }
    },
});
