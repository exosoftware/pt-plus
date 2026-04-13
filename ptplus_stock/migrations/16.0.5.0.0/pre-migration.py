from openupgradelib import openupgrade

field_renames = [
    ("product.template", "product_template", "categ_legal", "l10n_pt_legal_categ"),
    ("product.category", "product_category", "categ_legal", "l10n_pt_legal_categ"),
    (
        "res.company",
        "res_company",
        "multiway_tag_deliveryslip",
        "l10n_pt_multiway_tag_deliveryslip",
    ),
    (
        "res.config.settings",
        "res_config_settings",
        "multiway_tag_deliveryslip",
        "l10n_pt_multiway_tag_deliveryslip",
    ),
    (
        "stock.picking.type",
        "stock_picking_type",
        "disable_auto_issuance",
        "l10n_pt_disable_auto_issuance",
    ),
    (
        "stock.picking.type",
        "stock_picking_type",
        "disable_fiscal_document",
        "l10n_pt_disable_fiscal_document",
    ),
    ("stock.picking", "stock_picking", "delivery_start", "l10n_pt_delivery_start"),
    ("stock.picking", "stock_picking", "delivery_end", "l10n_pt_delivery_end"),
    ("stock.picking", "stock_picking", "delivery_code", "l10n_pt_delivery_code"),
    ("stock.picking", "stock_picking", "license_plate", "l10n_pt_license_plate"),
    ("stock.picking", "stock_picking", "date_issued", "l10n_pt_date_issued"),
]


@openupgrade.migrate()
def migrate(env, version):
    if "delivery_start" in env["stock.picking"]._fields:
        openupgrade.rename_fields(env, field_renames)
