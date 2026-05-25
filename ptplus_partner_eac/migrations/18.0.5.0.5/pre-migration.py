import logging

from openupgradelib import openupgrade

_logger = logging.getLogger(__name__)


@openupgrade.migrate()
def migrate(env, version):

    _logger.info("Removing noupdate flag from eac recs")
    env.cr.execute(
        """
        UPDATE ir_model_data
        SET noupdate = FALSE
        WHERE module = 'ptplus_partner_eac'
          AND
            model = 'l10n_pt.company.eac';
        """,
    )
