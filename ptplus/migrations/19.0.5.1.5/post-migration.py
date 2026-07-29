import logging

from openupgradelib import openupgrade

_logger = logging.getLogger(__name__)  # pylint: disable=C0103


@openupgrade.migrate()
def migrate(env, version):
    # "IVA 6% AQ. (OB)" is the reduced rate purchase tax the E-Fatura tax
    # mapping defaults to, so it must be selectable on vendor bills. It used
    # to ship archived: unarchive it on the companies that already have it.
    openupgrade.logged_query(
        env.cr,
        """
        UPDATE account_tax
        SET active = TRUE
        FROM ir_model_data
        WHERE ir_model_data.model = 'account.tax'
          AND ir_model_data.res_id = account_tax.id
          AND ir_model_data.name LIKE '%%_account_tax_template_iva_6_aq_ob'
          AND account_tax.active IS NOT TRUE;
        """,
    )
