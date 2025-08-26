from openupgradelib import openupgrade

field_renames = [
    ("account.tax", "account_tax", "has_move_lines", "l10n_pt_has_move_lines"),
]

_model_renames = [
    ("l10n_pt.account.tax.statement", "l10n_pt.account.statement"),
    ("l10n_pt.account.tax.statement.line", "l10n_pt.account.statement.line"),
    ("l10n_pt.wizard.tax.statement", "l10n_pt.wizard.statement"),
]

_table_renames = [
    ("l10n_pt_account_tax_statement", "l10n_pt_account_statement"),
    ("l10n_pt_account_tax_statement_line", "l10n_pt_account_statement_line"),
    ("l10n_pt_wizard_tax_statement", "l10n_pt_wizard_statement"),
]

# _module_rename = [
#     ("ptplus_accounting_tax_statement", "ptplus_accounting_statement"),
# ]


@openupgrade.migrate()
def migrate(env, version):
    if env["ir.model"].search([("model", "=", "l10n_pt.account.tax.statement")]):
        openupgrade.rename_models(env.cr, _model_renames)
        openupgrade.rename_tables(env.cr, _table_renames)

    # if env["ir.model"].search([("modules", "=", "ptplus_accounting_tax_statement")]):
    #     openupgrade.update_module_names(env.cr, _module_rename)
