from openupgradelib import openupgrade


@openupgrade.migrate()
def migrate(env, version):
    taxes = env["account.tax"].with_context({"active_test": False}).search([])
    for tax in taxes:
        tax.write({"invoice_label": tax.description, "description": tax.invoice_label})
