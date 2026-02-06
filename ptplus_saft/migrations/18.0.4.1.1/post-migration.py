from openupgradelib import openupgrade


@openupgrade.migrate()
def migrate(env, version):
    # Delete constraint duw to field changes
    openupgrade.delete_sql_constraint_safely(
        env,
        "ptplus_saft",
        "l10n_pt_account_saft_import",
        "partner_id_fkey",
    )
