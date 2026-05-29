/** @odoo-module */
import {patch} from "@web/core/utils/patch";
import {PosOrder} from "@point_of_sale/app/models/pos_order";
import {PosOrderline} from "@point_of_sale/app/models/pos_order_line";
import {PosStore} from "@point_of_sale/app/services/pos_store";

patch(PosOrder.prototype, {
    setup(options) {
        super.setup(...arguments);
        this._sdrBuildInProgress = false;
    },

    removeOrderline(line) {
        const removed = super.removeOrderline(line);
        this._l10nPtSdrBuildLine();
        return removed;
    },

    _l10nPtSdrCanComputeLine() {
        return this.config.l10n_pt_invoicing && this.company.l10n_pt_sdr_product_id;
    },

    _l10nPtSdrCanAutoComputeLine() {
        return this._l10nPtSdrCanComputeLine() && this.company.l10n_pt_sdr_auto_compute;
    },

    _l10nPtSdrProduct() {
        return this.company.l10n_pt_sdr_product_id;
    },

    _l10nPtSdrLines() {
        const sdrProduct = this._l10nPtSdrProduct();
        return this.lines.filter(
            (l) => l.product_id && l.product_id.id === sdrProduct.id
        );
    },

    _l10nPtSdrFlaggedLines() {
        const sdrProduct = this._l10nPtSdrProduct();
        return this.lines.filter(
            (l) =>
                l.product_id &&
                l.product_id.id !== sdrProduct.id &&
                l.product_id.product_tmpl_id?.l10n_pt_sdr_volta
        );
    },

    _l10nPtSdrComputeQty() {
        return this._l10nPtSdrFlaggedLines().reduce((sum, line) => sum + line.qty, 0);
    },

    _l10nPtSdrQtyChanged(qty) {
        return (
            this.uiState.l10nPtSdrBaseQty === undefined ||
            qty !== this.uiState.l10nPtSdrBaseQty
        );
    },

    _l10nPtSdrBuildLine({force = false} = {}) {
        if (this._sdrBuildInProgress) {
            return;
        }
        if (
            !(force
                ? this._l10nPtSdrCanComputeLine()
                : this._l10nPtSdrCanAutoComputeLine())
        ) {
            return;
        }

        const qty = this._l10nPtSdrComputeQty();
        const sdrLines = this._l10nPtSdrLines();
        if (
            !force &&
            !this._l10nPtSdrQtyChanged(qty) &&
            !(qty === 0 && sdrLines.length)
        ) {
            return;
        }

        this._sdrBuildInProgress = true;
        try {
            this.uiState.l10nPtSdrBaseQty = qty;
            const sdrProduct = this._l10nPtSdrProduct();

            // Collapse stray deposit lines: keep the first one, drop the rest.
            sdrLines.slice(1).forEach((l) => l.delete());
            const sdrLine = sdrLines[0];

            if (!qty) {
                if (sdrLine) {
                    sdrLine.delete();
                }
                return;
            }
            if (sdrLine) {
                sdrLine.setQuantity(qty, true);
            } else {
                const productTemplate = sdrProduct.product_tmpl_id;
                this.models["pos.order.line"].create({
                    order_id: this,
                    product_id: sdrProduct,
                    qty: qty,
                    price_unit: sdrProduct.lst_price,
                    tax_ids: productTemplate.taxes_id.map((t) => ["link", t]),
                });
            }
        } finally {
            this._sdrBuildInProgress = false;
        }
    },
});

patch(PosOrderline.prototype, {
    setQuantity(quantity, keep_price) {
        const result = super.setQuantity(...arguments);
        const sdrProduct = this.order_id?._l10nPtSdrProduct?.();
        if (result === true && this.product_id?.id !== sdrProduct?.id) {
            this.order_id?._l10nPtSdrBuildLine();
        }
        return result;
    },
});

patch(PosStore.prototype, {
    async addLineToOrder(vals, order, opts = {}, configure = true) {
        const line = await super.addLineToOrder(vals, order, opts, configure);
        order._l10nPtSdrBuildLine();
        return line;
    },
});
