import {_t} from "@web/core/l10n/translation";
import {registry} from "@web/core/registry";
import {useService} from "@web/core/utils/hooks";

/**
 * Notification of a cash flow classification just written, with an Undo
 * button while it shows (``params.undo``: the model, method and args that
 * put things back), followed by ``params.next``.
 */
function classifiedNotification(env, action) {
    const actionService = useService("action");
    const notification = useService("notification");
    const orm = useService("orm");
    const params = action.params || {};
    const buttons = [];
    let close = () => {};
    if (params.undo) {
        buttons.push({
            name: _t("Undo"),
            icon: "undo",
            primary: true,
            onClick: async () => {
                close();
                await orm.call(params.undo.model, params.undo.method, params.undo.args);
                await actionService.doAction("soft_reload");
            },
        });
    }
    close = notification.add(params.message, {
        type: params.type || "success",
        buttons,
    });
    return params.next;
}

registry.category("actions").add("l10n_pt_cashflow_classified", classifiedNotification);
