import {patch} from "@web/core/utils/patch";
import {PaymentScreen} from "@point_of_sale/app/screens/payment_screen/payment_screen";

patch(PaymentScreen.prototype, {
    get isForcedToInvoice() {
        return this.pos.config.l10n_pt_invoicing || super.isForcedToInvoice;
    },
});
