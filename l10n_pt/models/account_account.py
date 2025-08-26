from odoo import fields, models


class AccountAccount(models.Model):
    _inherit = "account.account"

    l10n_pt_taxonomy_code = fields.Integer(string="Taxonomy code")
