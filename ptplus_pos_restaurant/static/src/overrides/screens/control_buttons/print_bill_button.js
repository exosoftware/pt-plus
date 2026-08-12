/** @odoo-module */
import {ControlButtons} from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";
import {patch} from "@web/core/utils/patch";

patch(ControlButtons.prototype, {
    async clickPrintBill() {
        const order = this.pos.getOrder();
        if (this.pos.config.l10n_pt_invoicing && !this.pos.isOrderBillLocked(order)) {
            const wasBill = order.l10n_pt_is_bill;
            let syncedOrders = [];
            order.l10n_pt_is_bill = true;

            try {
                syncedOrders = await this.pos.syncAllOrders({
                    orders: [order],
                    throw: true,
                });
            } catch (error) {
                order.l10n_pt_is_bill = wasBill;
                throw error;
            }

            order._l10n_pt_bill_locked = true;

            try {
                await this.pos.updateOrderWithPTBillDetails(
                    order,
                    syncedOrders.length
                        ? syncedOrders.map((savedOrder) => savedOrder.id)
                        : [order.id]
                );
            } catch (error) {
                console.warn(
                    "Unable to refresh PT bill details after syncing the POS bill.",
                    error
                );
            }
        }
        await super.clickPrintBill();
    },
});
