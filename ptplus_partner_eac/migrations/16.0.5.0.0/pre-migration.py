from openupgradelib import openupgrade

field_renames = [
    ("res.company", "res_company", "eac_ids", "l10n_pt_eac_ids"),
    ("res.partner", "res_partner", "eac_ids", "l10n_pt_eac_ids"),
]

_model_renames = [
    ("company.eac", "l10n_pt.company.eac"),
    ("res.partner.eac", "l10n_pt.res.partner.eac"),
]

_table_renames = [
    ("company_eac", "l10n_pt_company_eac"),
    ("res_partner_eac", "l10n_pt_res_partner_eac"),
]


@openupgrade.migrate()
def migrate(env, version):
    if "eac_ids" in env["res.company"]._fields:
        openupgrade.rename_fields(env, field_renames)

    if env["ir.model"].search([("model", "=", "company.eac")]):
        openupgrade.rename_models(env.cr, _model_renames)
        openupgrade.rename_tables(env.cr, _table_renames)
