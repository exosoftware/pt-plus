from openupgradelib import openupgrade


@openupgrade.migrate()
def migrate(env, version):
    for company in env["res.company"].search([]):
        env["account.chart.template"]._l10n_pt_set_account_taxonomies(
            company.chart_template, company
        )
