/** @odoo-module */
import {ListController} from "@web/views/list/list_controller";
import {registry} from "@web/core/registry";
import {listView} from "@web/views/list/list_view";
export class SaftListController extends ListController {
    setup() {
        super.setup();
    }
    OnSaftImportClick() {
        this.actionService.doAction("ptplus_saft.action_dataport_import_saft_form");
    }
    OnImportSaftConfigurationClick() {
        this.actionService.doAction(
            "ptplus_saft.action_l10n_pt_import_saft_configuration_form"
        );
    }
}
registry.category("views").add("l10n_pt_saft_list", {
    ...listView,
    Controller: SaftListController,
    buttonTemplate: "button_saft.ListView.Buttons",
});
