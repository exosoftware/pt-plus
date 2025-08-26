from openupgradelib import openupgrade

field_renames = [
    ("pos.order", "pos_order", "l10n_ptplus_unique_id", "l10n_pt_unique_id"),
]


@openupgrade.migrate()
def migrate(env, version):
    if "l10n_ptplus_unique_id" in env["pos.order"]._fields:
        openupgrade.rename_fields(env, field_renames)
