from openupgradelib import openupgrade

field_renames = [
    (
        "account.move",
        "account_move",
        "rappel_credit_note",
        "l10n_pt_rappel_credit_note",
    ),
]


@openupgrade.migrate()
def migrate(env, version):
    if "rappel_credit_note" in env["account.move"]._fields:
        openupgrade.rename_fields(env, field_renames)
