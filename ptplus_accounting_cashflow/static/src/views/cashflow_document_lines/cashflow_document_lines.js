import {onWillStart, onWillUpdateProps} from "@odoo/owl";
import {_t} from "@web/core/l10n/translation";
import {registry} from "@web/core/registry";
import {TagsList} from "@web/core/tags_list/tags_list";
import {useService} from "@web/core/utils/hooks";
import {formatMonetary} from "@web/views/fields/formatters";
import {ListRenderer} from "@web/views/list/list_renderer";
import {listView} from "@web/views/list/list_view";

/**
 * List of the document lines to classify, grouped by movement: the group
 * header shows the distribution on the movement and, when proposals wait to
 * be accepted, the one accepting them would give.
 */
export class CashflowDocumentLinesRenderer extends ListRenderer {
    static groupRowTemplate = "ptplus_accounting_cashflow.DocumentLinesGroupRow";
    static components = {...ListRenderer.components, TagsList};

    setup() {
        super.setup();
        this.orm = useService("orm");
        this.movementDistributions = {};
        onWillStart(() => this.loadMovementDistributions(this.props.list));
        onWillUpdateProps((nextProps) =>
            this.loadMovementDistributions(nextProps.list)
        );
    }

    async loadMovementDistributions(list) {
        const wizardId = list.context.default_wizard_id;
        if (!wizardId || !list.isGrouped) {
            this.movementDistributions = {};
            return;
        }
        this.movementDistributions = await this.orm.call(
            "l10n_pt.cashflow.backfill.wizard.document.line",
            "get_movement_distributions",
            [wizardId]
        );
    }

    movementDistribution(group) {
        if (group.groupByField.name !== "movement_line_id") {
            return null;
        }
        const data = this.movementDistributions[group.value];
        if (!data) {
            return null;
        }
        const format = (amount) =>
            formatMonetary(amount, {currencyId: data.currency_id});
        const toTags = (part) => {
            const tags = part.tags.map((tag) => ({
                id: `category_${tag.id}`,
                text: `${tag.label}: ${format(tag.amount)}`,
                colorIndex: tag.color || 0,
                title: `${tag.display_name}: ${format(tag.amount)}`,
            }));
            if (part.remainder) {
                const toClassify = _t("To classify");
                const text = `${toClassify}: ${format(part.remainder)}`;
                tags.push({id: "to_classify", text, title: text, colorIndex: 1});
            } else if (!tags.length) {
                tags.push({id: "to_classify", text: _t("To classify"), colorIndex: 1});
            }
            return tags;
        };
        return {
            current: toTags(data.current),
            pending: data.pending ? toTags(data.pending) : null,
        };
    }
}

export const cashflowDocumentLinesListView = {
    ...listView,
    Renderer: CashflowDocumentLinesRenderer,
};

registry
    .category("views")
    .add("l10n_pt_cashflow_document_lines", cashflowDocumentLinesListView);
