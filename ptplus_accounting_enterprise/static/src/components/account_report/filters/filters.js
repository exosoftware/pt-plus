/** @odoo-module **/

import {AccountReportFilters} from "@account_reports/components/account_report/filters/filters";
import {patch} from "@web/core/utils/patch";
import {_t} from "@web/core/l10n/translation";

patch(AccountReportFilters.prototype, {
    get filterExtraOptionsData() {
        const res = super.filterExtraOptionsData;
        const filters = this.controller.filters;
        const cachedFilterOptions = this.controller.cachedFilterOptions;

        if (filters.show_unfold_partners && filters.show_unfold_partners !== "never") {
            res.unfold_partners = {
                name: _t("Unfold Partners"),
                show: Boolean(cachedFilterOptions.show_partner_breakdown),
            };
        }
        if (
            filters.show_partner_breakdown &&
            filters.show_partner_breakdown !== "never"
        ) {
            res.show_partner_breakdown = {
                name: _t("Show Partner Breakdown"),
            };
        }

        return res;
    },
});
