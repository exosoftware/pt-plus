/** @odoo-module */
import {_t} from "@web/core/l10n/translation";
import {patch} from "@web/core/utils/patch";
import {ControlButtons} from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";

patch(ControlButtons.prototype, {
    clickL10nPtSdrRecompute() {
        this.currentOrder?._l10nPtSdrBuildLine({force: true});
        this.notification.add(_t("SDR computed successfully."), {type: "success"});
        this.props.close?.();
    },

    displayL10nPtSdrRecomputeBtn() {
        return this.currentOrder?._l10nPtSdrCanComputeLine?.();
    },
});
