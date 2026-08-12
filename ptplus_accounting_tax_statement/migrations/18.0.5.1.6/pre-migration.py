import logging

from openupgradelib import openupgrade

_logger = logging.getLogger(__name__)  # pylint: disable=C0103


@openupgrade.migrate()
def migrate(env, version):

    # Remove the withholding tax statements
    openupgrade.logged_query(
        env.cr,
        """
        DELETE FROM l10n_pt_account_statement
        WHERE type IN ('withholding.monthly', 'withholding.annual');
        """,
    )

    openupgrade.logged_query(
        env.cr,
        """
        DELETE FROM l10n_pt_account_statement
        WHERE type IN ('resident.income', 'non.resident.income');
        """,
    )
