from openupgradelib import openupgrade

field_renames = [
    (
        "res.company",
        "res_company",
        "l10n_pt_edi_saphety_username",
        "l10n_pt_edi_saphety_username"
    ),
    (
        "res.company",
        "res_company",
        "l10n_pt_edi_saphety_password",
        "l10n_pt_edi_saphety_password"
    ),
    (
        "res.config.settings",
        "res_config_settings",
        "l10n_pt_edi_saphety_username",
        "l10n_pt_edi_saphety_username"
    ),
    (
        "res.config.settings",
        "res_config_settings",
        "l10n_pt_edi_saphety_password",
        "l10n_pt_edi_saphety_password"
    ),
]


@openupgrade.migrate()
def migrate(env, version):
    openupgrade.rename_fields(env, field_renames)
