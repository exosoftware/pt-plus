from openupgradelib import openupgrade

field_renames = [
    ("mis.report", "mis_report", "autogen", "l10n_pt_autogen"),
    ("mis.report", "mis_report", "autogen_tainted", "l10n_pt_autogen_tainted"),
    ("mis.report", "mis_report", "autogen_visibility", "l10n_pt_autogen_visibility"),
    ("mis.report", "mis_report", "autogen_expression", "l10n_pt_autogen_expression"),
    ("mis.report", "mis_report", "autogen_totals", "l10n_pt_autogen_totals"),
]

@openupgrade.migrate()
def migrate(env, version):
    if "autogen" in env["mis.report"]._fields:
        openupgrade.rename_fields(env, field_renames)
