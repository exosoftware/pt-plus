import {ControlButtons} from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";
import {patch} from "@web/core/utils/patch";

patch(ControlButtons.prototype, {
    async clickPrintBill() {
        const order = this.pos.getOrder();
        if (this.pos.config.l10n_pt_invoicing && !this.pos.isOrderBillLocked(order)) {
            // The server issues the bill (CM) when the order is synced
            order.l10n_pt_is_bill = true;
            try {
                await this.pos.syncAllOrders({orders: [order], throw: true});
            } catch (error) {
                order.l10n_pt_is_bill = false;
                throw error;
            }
        }
        await super.clickPrintBill();
    },
});
