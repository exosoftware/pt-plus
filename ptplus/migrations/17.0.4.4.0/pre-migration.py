from odoo import SUPERUSER_ID, api


def migrate(cr, version):
    env = api.Environment(cr, SUPERUSER_ID, {})
    taxes = env["account.tax"].with_context(active_test=False).search([])
    for tax in taxes:
        tax.write({"invoice_label": tax.description, "description": tax.invoice_label})
