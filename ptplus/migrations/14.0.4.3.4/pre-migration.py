from openupgradelib import openupgrade

field_renames = [
    ("account.tax", "account_tax", "pt_genre", "l10n_pt_genre"),
]

_field_adds = [
    ("l10n_pt_genre", "account.tax.group", "account_tax_group", "selection", False, "ptplus"),
]

@openupgrade.migrate()
def migrate(env, version):
    pass
    # if "pt_genre" in env["account.tax"]._fields:
    #     pt_taxes = env["account.tax"].search([
    #         ("country_code", "=", "PT"),
    #     ])
    #
    #     openupgrade.add_fields(env, _field_adds)
    #
    #     for tax in pt_taxes:
    #         if not tax.tax_group_id:
    #             continue
    #         tax.tax_group_id.l10n_pt_genre = tax.pt_genre
    #
    #     openupgrade.rename_fields(env, field_renames)
