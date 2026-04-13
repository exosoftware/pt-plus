from openupgradelib import openupgrade

field_renames = [
    ("account.account", "account_account", "taxonomy_id", "l10n_pt_taxonomy_id"),
    ("account.account", "account_account", "is_virtual", "l10n_pt_is_virtual"),
    ("res.company", "res_company", "taxonomy_ref", "l10n_pt_taxonomy_ref"),
    (
        "account.journal",
        "account_journal",
        "pt_transaction_type",
        "l10n_pt_transaction_type",
    ),
    (
        "account.move",
        "account_move",
        "vat_adjustment_norm_id",
        "l10n_pt_vat_adjustment_norm_id",
    ),
    (
        "account.move",
        "account_move",
        "vat_adjustment_requests_policy",
        "l10n_pt_vat_adjustment_requests_policy",
    ),
    (
        "account.move",
        "account_move",
        "vat_adjustment_request_number",
        "l10n_pt_vat_adjustment_request_number",
    ),
    (
        "account.move.reversal",
        "account_move_reversal",
        "vat_adjustment_norm_id",
        "l10n_pt_vat_adjustment_norm_id",
    ),
    (
        "account.move.reversal",
        "account_move_reversal",
        "vat_adjustment_requests_policy",
        "l10n_pt_vat_adjustment_requests_policy",
    ),
    (
        "account.move.reversal",
        "account_move_reversal",
        "vat_adjustment_request_number",
        "l10n_pt_vat_adjustment_request_number",
    ),
]

_model_renames = [
    ("account.asset.legal_rate", "l10n_pt.account.asset.legal_rate"),
    ("account.vat.adjustment_norm", "l10n_pt.account.vat.adjustment_norm"),
    ("account.taxonomy", "l10n_pt.account.taxonomy"),
    ("account.taxonomy.setup.wizard", "l10n_pt.account.taxonomy.setup.wizard"),
]

_table_renames = [
    ("account_asset_legal_rate", "l10n_pt_account_asset_legal_rate"),
    ("account_vat_adjustment_norm", "l10n_pt_account_vat_adjustment_norm"),
    ("account_taxonomy", "l10n_pt_account_taxonomy"),
    ("account_taxonomy_setup_wizard", "l10n_pt_account_taxonomy_setup_wizard"),
]


@openupgrade.migrate()
def migrate(env, version):
    if "vat_adjustment_norm_id" in env["account.move"]._fields:
        openupgrade.rename_fields(env, field_renames)

    if env["ir.model"].search([("model", "=", "account.asset.legal_rate")]):
        openupgrade.rename_models(env.cr, _model_renames)
        openupgrade.rename_tables(env.cr, _table_renames)

    openupgrade.logged_query(
        env.cr,
        """
        DELETE FROM ir_model_data WHERE name LIKE '%account_tax_tag_setup_wizard'
        """,
    )
    openupgrade.logged_query(
        env.cr,
        """
        DELETE FROM ir_model_fields WHERE model = 'account.tax.tag.setup.wizard'
        """,
    )
    # openupgrade.logged_query(
    #     env.cr,
    #     """
    #     DROP TABLE account_tax_tag_setup_wizard
    #     """,
    # )
