import logging

from openupgradelib import openupgrade

_logger = logging.getLogger(__name__)

xmlids_spec = [
    ("ptplus.tax_tag_iva_dp_1", "ptplus.tax_tag_iva_dp_1_v"),
    ("ptplus.tax_tag_iva_dp_3", "ptplus.tax_tag_iva_dp_3_v"),
    ("ptplus.tax_tag_iva_dp_5", "ptplus.tax_tag_iva_dp_5_v"),
]


@openupgrade.migrate()
def migrate(env, version):
    try:
        if env.ref("ptplus.tax_tag_iva_dp_3"):
            openupgrade.rename_xmlids(env.cr, xmlids_spec)
    except Exception as e:
        _logger.warning(f"An exception occurred during migration: {e}")
