from openupgradelib import openupgrade


xmlids_spec = [
    (
        "ptplus.account_snc_common_27812",
        "ptplus.account_snc_common_278121"
    ),
]

@openupgrade.migrate()
def migrate(env, version):
    try:
        account = env.ref("ptplus.account_snc_common_27812")
        if account:
            openupgrade.rename_xmlids(env.cr, xmlids_spec)
            # Get companies using PT+ CoA
            chart_templates = env["account.chart.template"]._get_pt_charts()
            pt_companies = env["res.company"].search([
                ("chart_template_id", "in", chart_templates.ids)
            ])
            env["account.account"].search(
                [("code", "=", "27812"), ("company_id", "in", pt_companies.ids)]).\
                write({"code": "278121"})
    except Exception:
        pass
