import logging

from openupgradelib import openupgrade

_logger = logging.getLogger(__name__)

xmlids_spec = [
    (
        "ptplus_accounting_tax_statement.tax_stmt_asset_value_adjustment",
        "ptplus_accounting_tax_statement.accounting_stmt_asset_value_adjustment",
    ),
]


@openupgrade.migrate()
def migrate(env, version):
    try:
        if env.ref("ptplus_accounting_tax_statement.tax_stmt_asset_value_adjustment"):
            openupgrade.rename_xmlids(env.cr, xmlids_spec)
    except Exception as e:
        _logger.warning(f"An exception occurred during migration: {e}")
