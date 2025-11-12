from odoo import SUPERUSER_ID, api


def migrate(cr, version):
    env = api.Environment(cr, SUPERUSER_ID, {})
    if "l10n_ptplus_unique_id" in env["pos.order"]._fields:
        cr.execute(
            """
                ALTER TABLE pos_order
                RENAME COLUMN l10n_ptplus_unique_id TO l10n_pt_unique_id;
            """
        )
