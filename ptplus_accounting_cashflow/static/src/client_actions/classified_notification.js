import {_t} from "@web/core/l10n/translation";
import {registry} from "@web/core/registry";

/**
 * Notification of a cash flow classification just written, with an Undo
 * button while it shows (``params.undo``: the model, method and args that
 * put things back), followed by ``params.next``.
 */
function classifiedNotification(env, action) {
    const params = action.params || {};
    const buttons = [];
    let close = () => {};
    if (params.undo) {
        buttons.push({
            name: _t("Undo"),
            icon: "fa-undo",
            primary: true,
            onClick: async () => {
                close();
                await env.services.orm.call(
                    params.undo.model,
                    params.undo.method,
                    params.undo.args
                );
                await env.services.action.doAction("soft_reload");
            },
        });
    }
    close = env.services.notification.add(params.message, {
        type: params.type || "success",
        buttons,
    });
    return params.next;
}

registry.category("actions").add("l10n_pt_cashflow_classified", classifiedNotification);
