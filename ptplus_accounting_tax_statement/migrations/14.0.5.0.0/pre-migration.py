from openupgradelib import openupgrade

field_renames = [
    ("account.tax", "account_tax", "has_move_lines", "l10n_pt_has_move_lines"),
]

_model_renames = [
    ("account.tax.statement", "l10n_pt.account.tax.statement"),
    ("account.tax.statement.line", "l10n_pt.account.tax.statement.line"),
    ("wizard.tax_statement", "l10n_pt.wizard.tax.statement"),
    ("wizard.recap_statement", "l10n_pt.wizard.recap.statement"),
]

_table_renames = [
    ("account_tax_statement", "l10n_pt_account_tax_statement"),
    ("account_tax_statement_line", "l10n_pt_account_tax_statement_line"),
    ("wizard_tax_statement", "l10n_pt_wizard_tax_statement"),
    ("wizard_recap_statement", "l10n_pt_wizard_recap_statement"),
]

@openupgrade.migrate()
def migrate(env, version):
    if "has_move_lines" in env["account.tax"]._fields:
        openupgrade.rename_fields(env, field_renames)

    if env["ir.model"].search([("model", "=", "account.tax.statement")]):
        openupgrade.rename_models(env.cr, _model_renames)
        openupgrade.rename_tables(env.cr, _table_renames)
