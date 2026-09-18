##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
import logging

from openupgradelib import openupgrade

from odoo.tools import sql

from odoo.addons.ptplus_accounting_cashflow.hooks import fill_l10n_pt_cashflow_state

_logger = logging.getLogger(__name__)  # pylint: disable=C0103


@openupgrade.migrate()
def migrate(env, version):
    """Fill the new classification state before Odoo sees the column.

    Left to Odoo, a stored field added to ``account.move.line`` queues every
    journal item of the database for computation, which on a real accounting
    database runs for hours; a column that already exists is not a new one.
    """
    if sql.column_exists(env.cr, "account_move_line", "l10n_pt_cashflow_state"):
        return
    openupgrade.logged_query(
        env.cr,
        "ALTER TABLE account_move_line ADD COLUMN l10n_pt_cashflow_state varchar",
    )
    fill_l10n_pt_cashflow_state(env)
    _logger.info("Cash flow classification state filled for the existing entries")
