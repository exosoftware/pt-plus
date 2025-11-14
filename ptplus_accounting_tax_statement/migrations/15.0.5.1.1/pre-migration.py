from openupgradelib import openupgrade

xmlids_spec = [
    (
        "ptplus_accounting_tax_statement.tax_stmt_asset_value_adjustment",
        "ptplus_accounting_tax_statement.accounting_stmt_asset_value_adjustment"
    ),
]


@openupgrade.migrate()
def migrate(env, version):
    try:
        if env.ref("ptplus_accounting_tax_statement.tax_stmt_asset_value_adjustment"):
            openupgrade.rename_xmlids(env.cr, xmlids_spec)
    except:
        pass
