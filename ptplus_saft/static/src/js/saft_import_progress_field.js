/** @odoo-module **/

import {onWillUnmount} from "@odoo/owl";
import {registry} from "@web/core/registry";
import {useService} from "@web/core/utils/hooks";
import {CharField, charField} from "@web/views/fields/char/char_field";

/**
 * Char field that live-updates while a SAF-T import runs: it subscribes to
 * the configuration's bus channel (see ptplus_saft's ir.websocket override)
 * and reloads the record on every progress push, so the progress note, the
 * status bar and the buttons follow the background cron without F5.
 */
export class SaftImportProgressField extends CharField {
    setup() {
        super.setup();
        this.busService = useService("bus_service");
        const resId = this.props.record.resId;
        if (!resId) {
            return;
        }
        this.channel = `saft_import_${resId}`;
        this.onProgress = async (payload) => {
            if (payload.id !== resId || (await this.props.record.isDirty())) {
                return;
            }
            await this.props.record.model.root.load();
        };
        this.busService.addChannel(this.channel);
        this.busService.subscribe("saft_import_progress", this.onProgress);
        onWillUnmount(() => {
            this.busService.unsubscribe("saft_import_progress", this.onProgress);
            this.busService.deleteChannel(this.channel);
        });
    }
}

export const saftImportProgressField = {
    ...charField,
    component: SaftImportProgressField,
    displayName: "SAF-T Import Progress",
    supportedTypes: ["char"],
};

registry.category("fields").add("saft_import_progress", saftImportProgressField);
