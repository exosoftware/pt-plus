import {registry} from "@web/core/registry";
import {useService} from "@web/core/utils/hooks";
import {getNextTabableElement, getPreviousTabableElement} from "@web/core/utils/ui";
import {usePosition} from "@web/core/position/position_hook";
import {getActiveHotkey} from "@web/core/hotkeys/hotkey_service";
import {isMobileOS} from "@web/core/browser/feature_detection";
import {_t} from "@web/core/l10n/translation";
import {useRecordObserver} from "@web/model/relational_model/utils";

import {standardFieldProps} from "@web/views/fields/standard_field_props";
import {TagsList} from "@web/core/tags_list/tags_list";
import {formatMonetary} from "@web/views/fields/formatters";

import {Record} from "@web/model/record";
import {Field} from "@web/views/fields/field";
import {
    Component,
    useState,
    useRef,
    useExternalListener,
    onWillStart,
    onPatched,
} from "@odoo/owl";

/**
 * Distribution of a cash movement over the cash flow categories, as exact
 * signed amounts in company currency against the reference amount
 * (``amount_field``). UX cloned from the analytic distribution widget.
 */
export class CashflowDistribution extends Component {
    static template = "ptplus_accounting_cashflow.CashflowDistribution";
    static components = {
        TagsList,
        Record,
        Field,
    };

    static props = {
        ...standardFieldProps,
        amount_field: {type: String},
        hide_remainder: {type: Boolean, optional: true},
        placeholder: {type: String, optional: true},
    };

    setup() {
        this.orm = useService("orm");
        this.batchedOrm = useService("batchedOrm");

        this.state = useState({
            showDropdown: false,
            formattedData: [],
        });

        this.widgetRef = useRef("cashflowDistribution");
        this.dropdownRef = useRef("cashflowDropdown");
        this.mainRef = useRef("mainElement");
        this.addLineButton = useRef("addLineButton");
        usePosition("cashflowDropdown", () => this.widgetRef.el);

        this.nextId = 1;
        this.focusSelector = false;
        this.currentValue = this.props.record.data[this.props.name];

        onWillStart(this.willStart);
        useRecordObserver(this.willUpdateRecord.bind(this));
        onPatched(this.patched);

        useExternalListener(window, "click", this.onWindowClick, true);
        useExternalListener(window, "resize", this.onWindowResized);
    }

    // Lifecycle
    async willStart() {
        await this.jsonToData(this.props.record.data[this.props.name]);
    }

    async willUpdateRecord(record) {
        const valueChanged =
            JSON.stringify(this.currentValue) !==
            JSON.stringify(record.data[this.props.name]);
        if (valueChanged) {
            await this.jsonToData(record.data[this.props.name]);
        }
        this.currentValue = record.data[this.props.name];
    }

    patched() {
        this.focusToSelector();
    }

    categoryIesLabel(category) {
        // Official IES field codes of the category: both quadros when the
        // category feeds Q04-B and Q0701 (e.g. "A00305/A00408")
        return (
            [category.ies_04b_code, category.ies_0701_code].filter(Boolean).join("/") ||
            category.display_name
        );
    }

    // Data conversion
    async jsonToData(jsonFieldValue) {
        const categoryIds = jsonFieldValue
            ? Object.keys(jsonFieldValue).map((id) => parseInt(id))
            : [];
        const categoryDict = categoryIds.length
            ? await this.fetchCategories(categoryIds)
            : {};

        const distribution = [];
        for (const [categoryId, amount] of Object.entries(jsonFieldValue || {})) {
            const category = categoryDict[parseInt(categoryId)];
            distribution.push({
                id: this.nextId++,
                categoryId: category ? parseInt(categoryId) : false,
                categoryDisplayName: category ? category.display_name : "",
                categoryIesCode: category ? this.categoryIesLabel(category) : "",
                categoryColor: category ? category.color : 0,
                amount: amount,
            });
        }
        this.state.formattedData = distribution;
    }

    dataToJson() {
        const result = {};
        this.state.formattedData = this.state.formattedData.filter(
            (line) => line.categoryId
        );
        this.state.formattedData.map((line) => {
            result[line.categoryId] = (result[line.categoryId] || 0) + line.amount;
        });
        return Object.keys(result).length ? result : false;
    }

    async fetchCategories(ids) {
        const records = await this.batchedOrm.read(
            "l10n_pt.cashflow.category",
            ids,
            ["id", "display_name", "ies_04b_code", "ies_0701_code", "color"],
            {}
        );
        this.categoryCache = this.categoryCache || {};
        for (const record of records) {
            this.categoryCache[record.id] = record;
        }
        return Object.assign(
            {},
            ...records.map((r) => {
                const {id, ...rest} = r;
                return {[id]: rest};
            })
        );
    }

    recordProps(line) {
        const categoryFields = {
            id: {type: "int"},
            display_name: {type: "char"},
        };
        const recordFields = {
            category_id: {
                string: _t("Category"),
                relation: "l10n_pt.cashflow.category",
                type: "many2one",
                related: {
                    fields: categoryFields,
                    activeFields: categoryFields,
                },
            },
        };
        const values = {
            category_id: line.categoryId
                ? [line.categoryId, line.categoryDisplayName]
                : false,
        };
        // Amount column copied from the reference amount field
        const {string, name, type, currency_field} =
            this.props.record.fields[this.props.amount_field];
        recordFields.amount = {
            string: string,
            name: "amount",
            type: type,
            currency_field: currency_field,
            cellClass: "numeric_column_width",
        };
        values.amount = line.amount;
        // Percentage of the reference amount: a convenience input synced
        // with the amount, never stored
        if (this.percentageColumnEnabled) {
            recordFields.percentage = {
                string: _t("Percentage"),
                name: "percentage",
                type: "percentage",
                cellClass: "numeric_column_width",
                digits: [12, 2],
            };
            values.percentage = line.amount / this.referenceAmount;
        }
        if (currency_field) {
            const currencyFieldDef = this.props.record.fields[currency_field];
            recordFields[currency_field] = {
                name: currency_field,
                string: currencyFieldDef.string,
                type: currencyFieldDef.type,
                relation: currencyFieldDef.relation,
                invisible: true,
            };
            values[currency_field] = [this.props.record.data[currency_field].id, ""];
        }
        return {
            fields: recordFields,
            values: values,
            activeFields: recordFields,
            hooks: {
                onRecordChanged: async (record, changes) =>
                    await this.lineChanged(record, changes, line),
            },
        };
    }

    async lineChanged(record, changes, line) {
        const selected = record.data.category_id;
        line.categoryId = selected ? selected.id : false;
        line.categoryDisplayName = selected ? selected.display_name : "";
        if (selected) {
            this.categoryCache = this.categoryCache || {};
            if (!this.categoryCache[selected.id]) {
                await this.fetchCategories([selected.id]);
            }
            line.categoryIesCode = this.categoryIesLabel(
                this.categoryCache[selected.id]
            );
            line.categoryColor = this.categoryCache[selected.id].color || 0;
        } else {
            line.categoryIesCode = "";
            line.categoryColor = 0;
        }
        // The changes argument is not reliable to tell which column was
        // edited: compare the record values against the row state instead
        const amountChanged = record.data.amount !== line.amount;
        const linePercentage = this.percentageColumnEnabled
            ? line.amount / this.referenceAmount
            : 0;
        if (amountChanged) {
            line.amount = record.data.amount;
        } else if (
            this.percentageColumnEnabled &&
            Math.abs(record.data.percentage - linePercentage) > 0.000005
        ) {
            line.amount = this.roundAmount(
                this.referenceAmount * record.data.percentage
            );
        }
    }

    roundAmount(amount) {
        // Company currencies of the PT localization use 2 decimals
        return Math.round(amount * 100) / 100;
    }

    get percentageColumnEnabled() {
        return Boolean(this.referenceAmount);
    }

    // Getters
    get editingRecord() {
        return !this.props.readonly && this.isRequired;
    }

    get isRequired() {
        // Only bank/cash journal items of companies with the cash flow
        // classification enabled are classifiable
        const required = this.props.record.data.l10n_pt_cashflow_required;
        return required === undefined ? true : Boolean(required);
    }

    get isDropdownOpen() {
        return this.state.showDropdown && !!this.dropdownRef.el;
    }

    get referenceAmount() {
        return this.props.record.data[this.props.amount_field] || 0;
    }

    get distributionTotal() {
        return this.state.formattedData.reduce(
            (total, line) => total + (line.amount || 0),
            0
        );
    }

    get isBalanced() {
        return Math.abs(this.distributionTotal - this.referenceAmount) < 0.005;
    }

    get isOverAllocated() {
        // The total must lie between zero and the reference amount
        const total = this.distributionTotal;
        const reference = this.referenceAmount;
        if (Math.abs(total) < 0.005) {
            return false;
        }
        if (!reference) {
            return true;
        }
        return (
            total > 0 !== reference > 0 || Math.abs(total) > Math.abs(reference) + 0.005
        );
    }

    get currencyId() {
        const currencyField =
            this.props.record.fields[this.props.amount_field].currency_field;
        const currency = currencyField && this.props.record.data[currencyField];
        return currency ? currency.id : undefined;
    }

    formatAmount(amount) {
        return formatMonetary(amount, {currencyId: this.currencyId});
    }

    summaryTags() {
        const tags = this.state.formattedData
            .filter((line) => line.categoryId)
            .map((line) => ({
                id: line.id,
                text: `${line.categoryIesCode}: ${this.formatAmount(line.amount)}`,
                // The tag carries the IES code; the tooltip spells the name
                title: `${line.categoryDisplayName}: ${this.formatAmount(line.amount)}`,
                colorIndex: line.categoryColor || 0,
                onClick: (ev) => this.tagClicked(ev),
            }));
        if (this.props.hide_remainder) {
            // A suggestion column: what the models propose, nothing about
            // what the movement itself still lacks
            return tags;
        }
        if (tags.length && this.isRequired && !this.isBalanced) {
            // Remainder tag on partial distributions. Its id must be truthy
            // and distinct from the line ids: the TagsList t-foreach keys on
            // "tag.id or tag_index" (falsy id = duplicate key OwlError)
            const remainder = this.roundAmount(
                this.referenceAmount - this.distributionTotal
            );
            tags.push({
                id: "to_classify",
                text: `${_t("To classify")}: ${this.formatAmount(remainder)}`,
                colorIndex: 1,
                onClick: (ev) => this.tagClicked(ev),
            });
        } else if (
            !tags.length &&
            this.isRequired &&
            this.props.record.data.l10n_pt_cashflow_to_classify
        ) {
            tags.push({
                id: "to_classify",
                text: _t("To classify"),
                colorIndex: 1,
                onClick: (ev) => this.tagClicked(ev),
            });
        }
        return tags;
    }

    // Actions
    addLine() {
        // Prefill exactly the remainder: 0 when the movement is already
        // fully distributed
        const remainder = this.roundAmount(
            this.referenceAmount - this.distributionTotal
        );
        this.state.formattedData.push({
            id: this.nextId++,
            categoryId: false,
            categoryDisplayName: "",
            categoryIesCode: "",
            categoryColor: 0,
            amount: remainder,
        });
        this.setFocusSelector(
            `[name=line_${this.state.formattedData.length - 1}] td:first-of-type`
        );
    }

    deleteLine(index) {
        this.state.formattedData.splice(index, 1);
        if (!this.state.formattedData.length) {
            this.addLine();
        }
    }

    async save() {
        await this.props.record.update({[this.props.name]: this.dataToJson()});
    }

    forceCloseEditor() {
        // focus to the main Element but the dropdown should not open
        this.preventOpen = true;
        this.closeCashflowEditor();
        this.mainRef.el.focus();
        this.preventOpen = false;
    }

    closeCashflowEditor() {
        // Always save what was entered: an invalid distribution surfaces
        // the server constraint error instead of being reverted silently
        this.save();
        this.state.showDropdown = false;
    }

    async openCashflowEditor() {
        if (!this.state.formattedData.length) {
            this.addLine();
        }
        this.setFocusSelector("[name='line_0'] td:first-of-type");
        this.state.showDropdown = true;
    }

    async tagClicked(ev) {
        if (this.editingRecord && !this.isDropdownOpen) {
            await this.openCashflowEditor();
        }
        if (this.isDropdownOpen) {
            this.setFocusSelector("[name='line_0'] td:first-of-type");
            this.focusToSelector();
            ev.stopPropagation();
        }
    }

    // Focus
    onMainElementFocus(ev) {
        if (!this.isDropdownOpen && !this.preventOpen) {
            this.openCashflowEditor();
        }
    }

    focusToSelector() {
        if (this.focusSelector && this.isDropdownOpen) {
            this.focus(
                this.adjacentElementToFocus(
                    "next",
                    this.dropdownRef.el.querySelector(this.focusSelector)
                )
            );
        }
        this.focusSelector = false;
    }

    setFocusSelector(selector) {
        this.focusSelector = selector;
    }

    adjacentElementToFocus(direction, el = null) {
        if (!this.isDropdownOpen) {
            return null;
        }
        if (!el) {
            el = this.dropdownRef.el;
        }
        return direction === "next"
            ? getNextTabableElement(el)
            : getPreviousTabableElement(el);
    }

    focusAdjacent(direction) {
        const elementToFocus = this.adjacentElementToFocus(direction);
        if (elementToFocus) {
            this.focus(elementToFocus);
            return true;
        }
        return false;
    }

    focus(el) {
        if (!el) {
            return;
        }
        el.focus();
        if (["INPUT", "TEXTAREA"].includes(el.tagName)) {
            if (el.selectionStart) {
                el.selectionStart = 0;
                el.selectionEnd = el.value.length;
            }
            el.select();
        }
    }

    // Keys and Clicks
    async onWidgetKeydown(ev) {
        if (!this.editingRecord) {
            return;
        }
        const hotkey = getActiveHotkey(ev);
        switch (hotkey) {
            case "enter":
            case "tab": {
                if (this.isDropdownOpen) {
                    const closestCell = ev.target.closest("td, th");
                    const row = closestCell.parentElement;
                    const line = this.state.formattedData[parseInt(row.id)];
                    if (
                        this.adjacentElementToFocus("next") === this.addLineButton.el &&
                        line &&
                        line.categoryId &&
                        !this.isBalanced
                    ) {
                        this.addLine();
                        break;
                    }
                    this.focusAdjacent("next") || this.forceCloseEditor();
                    break;
                }
                return;
            }
            case "shift+tab": {
                if (this.isDropdownOpen) {
                    this.focusAdjacent("previous") || this.forceCloseEditor();
                    break;
                }
                return;
            }
            case "escape": {
                if (this.isDropdownOpen) {
                    this.forceCloseEditor();
                    break;
                }
                return;
            }
            case "arrowdown": {
                if (!this.isDropdownOpen) {
                    this.onMainElementFocus();
                    break;
                }
                return;
            }
            default: {
                return;
            }
        }
        ev.preventDefault();
        ev.stopPropagation();
    }

    onWindowClick(ev) {
        const selectors = [
            ".o_popover",
            ".modal:not(.o_inactive_modal):not(:has(.o_act_window))",
        ];
        if (
            this.isDropdownOpen &&
            !this.widgetRef.el.contains(ev.target) &&
            (!ev.target.closest(selectors.join(",")) ||
                document
                    .querySelector(".modal:not(.o_inactive_modal)")
                    .contains(this.widgetRef.el)) &&
            !ev.target.isSameNode(document.documentElement)
        ) {
            this.forceCloseEditor();
        }
    }

    onWindowResized() {
        if (this.isDropdownOpen && !isMobileOS()) {
            this.forceCloseEditor();
        }
    }
}

export const cashflowDistribution = {
    component: CashflowDistribution,
    supportedTypes: ["json"],
    fieldDependencies: [
        {name: "l10n_pt_cashflow_required", type: "boolean"},
        {name: "l10n_pt_cashflow_to_classify", type: "boolean"},
    ],
    supportedOptions: [
        {
            label: _t("Amount field"),
            name: "amount_field",
            type: "field",
            availableTypes: ["monetary"],
        },
        {
            label: _t("Hide remainder"),
            name: "hide_remainder",
            type: "boolean",
        },
    ],
    extractProps: ({options, placeholder}) => ({
        amount_field: options.amount_field,
        hide_remainder: Boolean(options.hide_remainder),
        placeholder: placeholder,
    }),
};

registry.category("fields").add("l10n_pt_cashflow_distribution", cashflowDistribution);
