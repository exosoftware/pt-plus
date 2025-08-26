/** @odoo-module */
import {patch} from "@web/core/utils/patch";
import {PosStore} from "@point_of_sale/app/store/pos_store";

patch(PosStore.prototype, {
    getReceiptHeaderData(order) {
        const result = super.getReceiptHeaderData(...arguments);
        result.l10n_pt_invoicing = this.config.l10n_pt_invoicing;
        if (order) {
            result.partner = order.get_partner();
            result.l10n_pt_doc_name = order.l10n_pt_doc_name;
        }
        return result;
    },
});
