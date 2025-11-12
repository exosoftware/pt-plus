import logging

from openupgradelib import openupgrade

_logger = logging.getLogger(__name__)


@openupgrade.migrate()
def migrate(env, version):

    _logger.info("Adding temporary column 'code_tmp' to table 'l10n_pt_company_eac'...")
    env.cr.execute(
        """
        ALTER TABLE l10n_pt_company_eac
            ADD COLUMN code_tmp varchar;
        """
    )
    _logger.info("Temporary column added.")

    # Set code_tmp to the same value as code
    _logger.info("Copying values from 'code' to 'code_tmp'...")
    env.cr.execute(
        """
        UPDATE l10n_pt_company_eac
        SET code_tmp = code;
        """
    )
    _logger.info("Values copied.")
