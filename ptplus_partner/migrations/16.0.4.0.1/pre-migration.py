from openupgradelib import openupgrade

field_renames = [
    ("res.bank", "res_bank", "code", "l10n_pt_code"),
    ("res.bank", "res_bank", "lname", "l10n_pt_lname"),
    ("res.bank", "res_bank", "vat", "l10n_pt_vat"),
    ("res.bank", "res_bank", "website", "l10n_pt_website"),
]


@openupgrade.migrate()
def migrate(env, version):
    if "code" in env["res.bank"]._fields:
        openupgrade.rename_fields(env, field_renames)
