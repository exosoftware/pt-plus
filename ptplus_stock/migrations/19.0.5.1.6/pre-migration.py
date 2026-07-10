import logging

from openupgradelib import openupgrade

_logger = logging.getLogger(__name__)  # pylint: disable=C0103


@openupgrade.migrate()
def migrate(env, version):
    """Drop the reverted inventory loss account view.

    Its arch references ``l10n_pt_inventory_loss_account_id``, removed with the
    revert, so the stale view blocks the registry from loading. Deleting it lets
    Odoo garbage-collect the orphan field on its own.
    """
    openupgrade.logged_query(
        env.cr,
        """
        DELETE FROM ir_ui_view
        WHERE id IN (
            SELECT res_id FROM ir_model_data
            WHERE module = 'ptplus_stock'
              AND name = 'view_category_property_form_account_pt'
              AND model = 'ir.ui.view'
        )
        """,
    )
    openupgrade.logged_query(
        env.cr,
        """
        DELETE FROM ir_model_data
        WHERE module = 'ptplus_stock'
          AND name = 'view_category_property_form_account_pt'
        """,
    )
