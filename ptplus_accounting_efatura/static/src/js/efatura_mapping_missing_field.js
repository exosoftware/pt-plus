/** @odoo-module */
import {Component} from "@odoo/owl";
import {_t} from "@web/core/l10n/translation";
import {registry} from "@web/core/registry";
import {standardFieldProps} from "@web/views/fields/standard_field_props";

/**
 * Read-only warning sign for the e-fatura lines with no tax mapping. The core
 * boolean_icon widget can't be used: it renders a button that toggles the
 * field, and this one is computed.
 */
export class EfaturaMappingMissingField extends Component {
    static template = "ptplus_accounting_efatura.MappingMissingField";
    static props = {...standardFieldProps};

    get tooltip() {
        return _t("No tax mapping for this tax: use the + on the left to create it");
    }
}

export const efaturaMappingMissingField = {
    component: EfaturaMappingMissingField,
    supportedTypes: ["boolean"],
};

registry
    .category("fields")
    .add("l10n_pt_efatura_mapping_missing", efaturaMappingMissingField);
