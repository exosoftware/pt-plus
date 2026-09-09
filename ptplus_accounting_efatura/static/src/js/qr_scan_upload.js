import {patch} from "@web/core/utils/patch";

import {DocumentFileUploader} from "@account/components/document_file_uploader/document_file_uploader";
import {ExpenseKanbanController} from "@hr_expense/views/kanban";
import {ExpenseListController} from "@hr_expense/views/list";

import {askQrScanDecisions, reopenFilePicker} from "./qr_scan_decision";

/**
 * Run the standard upload while holding back the action it wants to open.
 *
 * The decisions about the photos have to be taken with the uploader still
 * alive and its file picker still on screen, and opening the uploaded
 * documents destroys both. The action is opened afterwards, unless nothing is
 * left of the upload or a new photo was asked for.
 *
 * @param {Object} component the uploader, or the expense view controller
 * @param {string} serviceName the attribute holding its action service
 * @param {Function} upload runs the standard upload
 * @returns {Promise<Object|null>} the action the upload wanted to open
 */
async function uploadHoldingAction(component, serviceName, upload) {
    const actionService = component[serviceName];
    let heldAction = null;
    // Delegate to the real service, so that everything but doAction (the
    // current controller, above all) still works while the upload runs
    const holder = Object.create(actionService);
    holder.doAction = (action) => {
        heldAction = action;
        return Promise.resolve();
    };
    component[serviceName] = holder;
    try {
        await upload();
    } finally {
        component[serviceName] = actionService;
    }
    return heldAction;
}

/**
 * Ask what to do with the documents the upload read no Portuguese QR code
 * from, and then open what the upload had to show, if anything is left of it.
 *
 * The services are taken from the environment rather than from the component:
 * an answer may take a while to come, and the ones a component hands out stop
 * working the moment it is destroyed.
 *
 * @param {Object} component the uploader, or the expense view controller
 * @param {number[]} attachmentIds the attachments this upload sent
 * @param {Object|null} heldAction the action the upload wanted to open
 * @param {Function} retryUpload reopens the file picker, for "Try Again"
 */
async function askUploadedQrScan(component, attachmentIds, heldAction, retryUpload) {
    const {orm, notification, action} = component.env.services;
    const pending = attachmentIds.length
        ? await orm.call("ir.attachment", "l10n_pt_qr_scan_pending", [attachmentIds])
        : [];
    if (pending.length) {
        const {discarded, retry} = await askQrScanDecisions(
            {orm, notification},
            pending
        );
        if (retry) {
            // The upload the new photo starts comes with an action of its own
            retryUpload();
            return;
        }
        if (discarded >= attachmentIds.length) {
            // Nothing is left of this upload: stay where the user was
            return;
        }
    }
    if (heldAction) {
        await action.doAction(heldAction);
    }
}

// Vendor bills, uploaded through a journal or the bills view
patch(DocumentFileUploader.prototype, {
    async onUploadComplete() {
        const attachmentIds = [...this.attachmentIdsToProcess];
        const args = arguments;
        const heldAction = await uploadHoldingAction(this, "action", () =>
            super.onUploadComplete(...args)
        );
        await askUploadedQrScan(this, attachmentIds, heldAction, reopenFilePicker);
    },
});

// Expense receipts, which is what the Odoo app photographs
const expenseQrScanPatch = () => ({
    async onUpload(attachments) {
        // Remember what went up: the scan outcome is read back by attachment.
        // Uploads pile up here, since a drag and drop can start another one
        // before the previous is through.
        this.l10nPtAttachmentIds = [
            ...(this.l10nPtAttachmentIds || []),
            ...attachments.map((attachment) => attachment.id),
        ];
        return super.onUpload(attachments);
    },

    async onChangeFileInput() {
        const heldAction = await uploadHoldingAction(this, "actionService", () =>
            super.onChangeFileInput()
        );
        const attachmentIds = this.l10nPtAttachmentIds || [];
        this.l10nPtAttachmentIds = [];
        await askUploadedQrScan(this, attachmentIds, heldAction, () =>
            this.uploadDocument()
        );
    },
});

patch(ExpenseListController.prototype, expenseQrScanPatch());
patch(ExpenseKanbanController.prototype, expenseQrScanPatch());
