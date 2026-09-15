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
        const actionParams = {
            additionalContext: context,
            // Reload the list once the wizard is gone, so the documents it
            // collected show up. Closing the dialog on the X runs no server
            // code, so this is the only hook both ways out go through.
            onClose: () => this.model.load(),
        };
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
