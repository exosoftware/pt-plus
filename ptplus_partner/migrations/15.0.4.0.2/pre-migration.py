from openupgradelib import openupgrade

field_renames = [
    ("res.partner", "res_partner", "legal_name", "l10n_pt_legal_name"),
]

@openupgrade.migrate()
def migrate(env, version):
    if "legal_name" in env["res.partner"]._fields:
        openupgrade.rename_fields(env, field_renames)
