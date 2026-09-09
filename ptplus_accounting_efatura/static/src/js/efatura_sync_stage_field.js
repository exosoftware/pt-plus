/** @odoo-module **/

import {onWillUnmount} from "@odoo/owl";
import {registry} from "@web/core/registry";
import {useService} from "@web/core/utils/hooks";
import {
    SelectionField,
    selectionField,
} from "@web/views/fields/selection/selection_field";

/**
 * The stage the background collection is on, live-updated while it runs: it
 * subscribes to the wizard's bus channel (see this module's ir.websocket
 * override) and reloads the record whenever the cron reports progress, so the
 * dialog fills itself in with the result once the collection is done.
 *
 * It sits on the stage and not on the state because the state field is
 * invisible on the inherited form, and an invisible field is never rendered:
 * its widget would never run.
 */
export class EfaturaSyncStageField extends SelectionField {
    setup() {
        super.setup();
        this.busService = useService("bus_service");
        const resId = this.props.record.resId;
        if (!resId) {
            return;
        }
        this.channel = `efatura_sync_${resId}`;
        this.onProgress = async (payload) => {
            if (payload.id !== resId || (await this.props.record.isDirty())) {
                return;
            }
            await this.props.record.model.root.load();
        };
        this.busService.addChannel(this.channel);
        this.busService.subscribe("efatura_sync_progress", this.onProgress);
        onWillUnmount(() => {
            this.busService.unsubscribe("efatura_sync_progress", this.onProgress);
            this.busService.deleteChannel(this.channel);
        });
    }
}

export const efaturaSyncStageField = {
    ...selectionField,
    component: EfaturaSyncStageField,
    displayName: "E-Fatura Synchronization Stage",
    supportedTypes: ["selection"],
};

registry.category("fields").add("efatura_sync_stage", efaturaSyncStageField);
