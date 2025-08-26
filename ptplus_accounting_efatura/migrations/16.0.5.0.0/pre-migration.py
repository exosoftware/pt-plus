from openupgradelib import openupgrade

field_renames = [
    ("account.move", "account_move", "efatura_id", "l10n_pt_efatura_id"),
    ("account.move", "account_move", "efatura_total", "l10n_pt_efatura_total"),
    ("account.move", "account_move", "efatura_mismatch", "l10n_pt_efatura_mismatch"),
    ("res.company", "res_company", "efatura", "l10n_pt_use_efatura"),
    ("res.company", "res_company", "efatura_product_id", "l10n_pt_efatura_product_id"),
    ("res.company", "res_company", "efatura_tax_id", "l10n_pt_efatura_tax_id"),
    ("res.company", "res_company", "efatura_journal_id", "l10n_pt_efatura_journal_id"),
    (
        "res.company",
        "res_company",
        "efatura_interm_tax_id",
        "l10n_pt_efatura_interm_tax_id",
    ),
    (
        "res.company",
        "res_company",
        "efatura_reduced_tax_id",
        "l10n_pt_efatura_reduced_tax_id",
    ),
    (
        "res.company",
        "res_company",
        "efatura_exempt_tax_id",
        "l10n_pt_efatura_exempt_tax_id",
    ),
    ("res.config.settings", "res_config_settings", "efatura", "l10n_pt_use_efatura"),
    (
        "res.config.settings",
        "res_config_settings",
        "efatura_product_id",
        "l10n_pt_efatura_product_id",
    ),
    (
        "res.config.settings",
        "res_config_settings",
        "efatura_tax_id",
        "l10n_pt_efatura_tax_id",
    ),
    (
        "res.config.settings",
        "res_config_settings",
        "efatura_journal_id",
        "l10n_pt_efatura_journal_id",
    ),
    (
        "res.config.settings",
        "res_config_settings",
        "efatura_interm_tax_id",
        "l10n_pt_efatura_interm_tax_id",
    ),
    (
        "res.config.settings",
        "res_config_settings",
        "efatura_reduced_tax_id",
        "l10n_pt_efatura_reduced_tax_id",
    ),
    (
        "res.config.settings",
        "res_config_settings",
        "efatura_exempt_tax_id",
        "l10n_pt_efatura_exempt_tax_id",
    ),
]

_model_renames = [
    ("account.efatura", "l10n_pt.account.efatura"),
    ("account.efatura.line", "l10n_pt.account.efatura.line"),
    ("account.move.efatura", "l10n_pt.account.move.efatura"),
    ("dataport.import.efatura", "l10n_pt.dataport.import.efatura"),
]

_table_renames = [
    ("account_efatura", "l10n_pt_account_efatura"),
    ("account_efatura_line", "l10n_pt_account_efatura_line"),
    ("account_move_efatura", "l10n_pt_account_move_efatura"),
    ("dataport_import_efatura", "l10n_pt_dataport_import_efatura"),
]


@openupgrade.migrate()
def migrate(env, version):
    if "efatura_id" in env["account.move"]._fields:
        openupgrade.rename_fields(env, field_renames)

    if not env["ir.model.fields"].search(
        [
            ("model", "=", "res.partner"),
            ("name", "=", "property_l10n_pt_efatura_product_id"),
        ]
    ):
        openupgrade.rename_property(
            env.cr,
            "res.partner",
            "property_efatura_product_id",
            "property_l10n_pt_efatura_product_id",
        )
        openupgrade.rename_property(
            env.cr,
            "res.partner",
            "property_efatura_tax_id",
            "property_l10n_pt_efatura_tax_id",
        )
        openupgrade.rename_property(
            env.cr,
            "res.partner",
            "property_efatura_interm_tax_id",
            "property_l10n_pt_efatura_interm_tax_id",
        )
        openupgrade.rename_property(
            env.cr,
            "res.partner",
            "property_efatura_reduced_tax_id",
            "property_l10n_pt_efatura_reduced_tax_id",
        )
        openupgrade.rename_property(
            env.cr,
            "res.partner",
            "property_efatura_exempt_tax_id",
            "property_l10n_pt_efatura_exempt_tax_id",
        )

    if env["ir.model"].search([("model", "=", "account.efatura")]):
        openupgrade.rename_models(env.cr, _model_renames)
        openupgrade.rename_tables(env.cr, _table_renames)
