/** @odoo-module */
import {ListController} from "@web/views/list/list_controller";
import {registry} from "@web/core/registry";
import {listView} from "@web/views/list/list_view";
export class EfaturaListController extends ListController {
    setup() {
        super.setup();
    }
    importEfatura() {
        const context = this.props.context;
        const actionParams = {additionalContext: context};
        this.actionService.doAction(
            "ptplus_accounting_efatura.dataport_import_efatura_action",
            actionParams
        );
    }
}
registry.category("views").add("l10n_pt_efatura_list", {
    ...listView,
    Controller: EfaturaListController,
    buttonTemplate: "button_efatura.ListView.Buttons",
});
