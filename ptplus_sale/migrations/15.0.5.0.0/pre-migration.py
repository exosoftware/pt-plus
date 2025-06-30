from openupgradelib import openupgrade

field_renames = [
    ("sale.order", "sale_order", "date_issued", "l10n_pt_date_issued"),
    ("sale.order", "sale_order", "quotation_id", "l10n_pt_quotation_id"),
    ("sale.order", "sale_order", "order_id", "l10n_pt_order_id"),
    (
        "res.company",
        "res_company",
        "multiway_tag_sale",
        "l10n_pt_multiway_tag_sale"
    ),
    (
        "res.config.settings",
        "res_config_settings",
        "multiway_tag_sale",
        "l10n_pt_multiway_tag_sale"
    ),
]


@openupgrade.migrate()
def migrate(env, version):
    if "date_issued" in env["sale.order"]._fields:
        openupgrade.rename_fields(env, field_renames)
