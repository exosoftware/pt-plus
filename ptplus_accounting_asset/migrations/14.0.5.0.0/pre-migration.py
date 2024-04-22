from openupgradelib import openupgrade

field_renames = [
    ("account.asset", "account_asset", "legal_rate_id", "l10n_pt_legal_rate_id"),
]

@openupgrade.migrate()
def migrate(env, version):
    if "legal_rate_id" in env["account.asset"]._fields:
        openupgrade.rename_fields(env, field_renames)
