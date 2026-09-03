import {_t} from "@web/core/l10n/translation";
import {patch} from "@web/core/utils/patch";
import {FileUploader} from "@web/views/fields/file_handler";

// "Try Again" has to reopen the very file picker the photo came from (the
// camera, on a phone). FileUploader keeps its <input> to itself, so remember
// the one in use as the upload goes through it.
let lastFileInput = null;

patch(FileUploader.prototype, {
    onFileChange(ev) {
        lastFileInput = ev.target;
        return super.onFileChange(ev);
    },
});

export function reopenFilePicker() {
    lastFileInput?.click();
}

function scanTitle(state) {
    return (
        {
            no_qr: _t("No QR Code Found"),
            unreadable_qr: _t("QR Code Not Readable"),
            other_company: _t("Document of Another Company"),
            unavailable: _t("QR Code Reader Unavailable"),
            timed_out: _t("QR Code Not Read in Time"),
        }[state] || _t("QR Code Not Read")
    );
}

function scanMessage(state, name) {
    switch (state) {
        case "unreadable_qr":
            return _t(
                "A QR code was found in %s, but it could not be read as the QR code of a Portuguese invoice. A sharper photo may be all it takes.",
                name
            );
        case "other_company":
            return _t(
                "%s was issued to another company, so nothing was read from it.",
                name
            );
        case "unavailable":
            // Retaking the photo would change nothing: it is the server that
            // cannot read any QR code
            return _t(
                "QR codes cannot be read on this server, so nothing was read " +
                    "from %s. Ask your support team to install the QR code " +
                    "reader.",
                name
            );
        case "timed_out":
            // A new photo of the same long document would be read no further
            return _t(
                "Reading the QR code of %s took too long and was interrupted. " +
                    "Attach the page carrying the QR code on its own to have " +
                    "it read.",
                name
            );
        default:
            // The title already says no QR code was found
            return _t("Nothing was read from %s.", name);
    }
}

/**
 * Ask the user what to do with one photo no Portuguese QR code could be read
 * from: keep the document as it is, reject it, or take a new one. Dismissing
 * the notification keeps the document, as accepting it does.
 *
 * @returns {Promise<"accept"|"reject"|"retry">}
 */
function askQrScanDecision(services, document, index, total) {
    const title =
        total > 1
            ? _t("%(title)s (%(index)s of %(total)s)", {
                  title: scanTitle(document.state),
                  index: index + 1,
                  total: total,
              })
            : scanTitle(document.state);
    return new Promise((resolve) => {
        const close = services.notification.add(
            scanMessage(document.state, document.attachment_name),
            {
                title: title,
                type: "warning",
                sticky: true,
                // Three buttons do not fit the standard layout: the class
                // lays them out under the message (see qr_scan_notification.scss)
                className: "o_l10n_pt_qr_scan_notification",
                onClose: () => resolve("accept"),
                buttons: [
                    {
                        name: _t("Accept"),
                        icon: "fa-check",
                        primary: true,
                        onClick: () => {
                            resolve("accept");
                            close();
                        },
                    },
                    {
                        name: _t("Reject"),
                        icon: "fa-times",
                        onClick: () => {
                            resolve("reject");
                            close();
                        },
                    },
                    // A new photo changes nothing when the server has no
                    // reader, or when the document is too long to be read
                    // through, so it is not offered
                    ...(["unavailable", "timed_out"].includes(document.state)
                        ? []
                        : [
                              {
                                  name: _t("Try Again"),
                                  icon: "fa-refresh",
                                  onClick: () => {
                                      resolve("retry");
                                      close();
                                  },
                              },
                          ]),
                ],
            }
        );
    });
}

/**
 * Walk the documents nothing was read from, one notification at a time, and
 * delete the ones the user rejects or wants to photograph again.
 *
 * @returns {Promise<{discarded: number, retry: boolean}>} how many documents
 *      were deleted, and whether a new photo was asked for.
 */
export async function askQrScanDecisions(services, pending) {
    let discarded = 0;
    let retry = false;
    for (const [index, document] of pending.entries()) {
        const decision = await askQrScanDecision(
            services,
            document,
            index,
            pending.length
        );
        if (decision === "accept") {
            continue;
        }
        await services.orm.call("ir.attachment", "l10n_pt_qr_scan_discard", [
            [document.attachment_id],
        ]);
        discarded++;
        retry = retry || decision === "retry";
    }
    return {discarded: discarded, retry: retry};
}
