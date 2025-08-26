import logging

from openupgradelib import openupgrade

_logger = logging.getLogger(__name__)

xmlids_spec = [
    ("ptplus.account_snc_common_27812", "ptplus.account_snc_common_278121"),
]


@openupgrade.migrate()
def migrate(env, version):
    try:
        account = env.ref("ptplus.account_snc_common_27812")
        if account:
            openupgrade.rename_xmlids(env.cr, xmlids_spec)
            pt_companies = env["res.company"].search([("country_code", "=", "PT")])
            env["account.account"].search(
                [("code", "=", "27812"), ("company_id", "in", pt_companies.ids)]
            ).write({"code": "278121"})
    except Exception as e:
        _logger.warning(f"An exception occurred during migration: {e}")
