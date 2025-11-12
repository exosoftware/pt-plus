from odoo import SUPERUSER_ID, api


def migrate(cr, version):
    env = api.Environment(cr, SUPERUSER_ID, {})
    if "legal_name" in env["res.partner"]._fields:  # noqa: E713
        cr.execute(
            """
            ALTER TABLE res_partner
            RENAME COLUMN legal_name TO l10n_pt_legal_name;
        """
        )
