from openupgradelib import openupgrade

field_renames = [
    (
        "pos.config",
        "pos_config",
        "pt_inv_fiscal_doc_type_id",
        "l10n_pt_inv_fiscal_doc_type_id",
    ),
    (
        "pos.config",
        "pos_config",
        "pt_cred_fiscal_doc_type_id",
        "l10n_pt_cred_fiscal_doc_type_id",
    ),
    ("pos.config", "pos_config", "pt_cert_code", "l10n_pt_cert_code"),
    (
        "pos.config",
        "pos_config",
        "pt_cert_priv_key_version",
        "l10n_pt_cert_priv_key_version",
    ),
    ("pos.config", "pos_config", "pt_cert_priv_key", "l10n_pt_cert_priv_key"),
    ("pos.config", "pos_config", "pt_invoicing", "l10n_pt_invoicing"),
    ("pos.config", "pos_config", "ptplus_unique_id", "l10n_ptplus_unique_id"),
]


@openupgrade.migrate()
def migrate(env, version):
    if "pt_inv_fiscal_doc_type_id" in env["pos.config"]._fields:
        openupgrade.rename_fields(env, field_renames)
