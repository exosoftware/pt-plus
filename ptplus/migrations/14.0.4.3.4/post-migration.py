from openupgradelib import openupgrade


@openupgrade.migrate()
def migrate(env, version):
    tax_groups = env["account.tax.group"].search([])

    for tax_group in tax_groups:
        if tax_group.name.startswith("VAT") or tax_group.name.startswith("IVA"):
            tax_group.l10n_pt_genre = "IVA"
        elif tax_group.name.startswith("IS") or tax_group.name.startswith("SD"):
            tax_group.l10n_pt_genre = "IS"
        elif tax_group.name.startswith("RF") or tax_group.name.startswith("WHT"):
            tax_group.l10n_pt_genre = "RF"
