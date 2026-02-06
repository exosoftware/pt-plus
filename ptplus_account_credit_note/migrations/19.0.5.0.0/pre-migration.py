import logging

from openupgradelib import openupgrade

_logger = logging.getLogger(__name__)  # pylint: disable=C0103

_module_rename = [
    ("account_invoice_refund_link", "ptplus_account_credit_note"),
]


@openupgrade.migrate()
def migrate(env, version):
    if env["ir.module.module"].search(
        [
            ("name", "=", "account_invoice_refund_link"),
            ("state", "in", ["installed", "to remove"]),
        ]
    ):
        openupgrade.update_module_names(env.cr, _module_rename)
