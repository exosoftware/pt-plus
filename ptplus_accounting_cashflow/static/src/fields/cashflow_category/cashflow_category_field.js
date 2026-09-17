import {_t} from "@web/core/l10n/translation";
import {registry} from "@web/core/registry";
import {
    Many2OneField,
    buildM2OFieldDescription,
    extractM2OFieldProps,
    m2oSupportedOptions,
} from "@web/views/fields/many2one/many2one_field";

/**
 * A cash flow category the way the distribution widget shows it: a colored
 * tag with the IES code when read, the plain many2one when edited.
 */
export class CashflowCategoryField extends Many2OneField {
    static template = "ptplus_accounting_cashflow.CashflowCategoryField";
    static props = {
        ...Many2OneField.props,
        labelField: {type: String, optional: true},
        colorField: {type: String, optional: true},
    };

    get tag() {
        const data = this.props.record.data;
        const value = data[this.props.name];
        if (!value) {
            return null;
        }
        return {
            label:
                (this.props.labelField && data[this.props.labelField]) ||
                value.display_name,
            color: (this.props.colorField && data[this.props.colorField]) || 0,
            title: value.display_name,
        };
    }
}

export const cashflowCategoryField = {
    ...buildM2OFieldDescription(CashflowCategoryField),
    supportedOptions: [
        ...m2oSupportedOptions,
        {
            label: _t("Label field"),
            name: "label_field",
            type: "field",
            availableTypes: ["char"],
        },
        {
            label: _t("Color field"),
            name: "color_field",
            type: "field",
            availableTypes: ["integer"],
        },
    ],
    extractProps(staticInfo, dynamicInfo) {
        return {
            ...extractM2OFieldProps(staticInfo, dynamicInfo),
            labelField: staticInfo.options.label_field,
            colorField: staticInfo.options.color_field,
        };
    },
    fieldDependencies: ({options}) =>
        [
            options.label_field && {name: options.label_field, type: "char"},
            options.color_field && {name: options.color_field, type: "integer"},
        ].filter(Boolean),
};

registry.category("fields").add("l10n_pt_cashflow_category", cashflowCategoryField);
