import logging

from openupgradelib import openupgrade

_logger = logging.getLogger(__name__)  # pylint: disable=C0103


@openupgrade.migrate()
def migrate(env, version):
    for table in ["account_move", "account_payment"]:
        _logger.info(f"Ensuring PT cancellation integrity on table {table}")

        env.cr.execute(
            f"""
            UPDATE {table}
            SET fiscal_document_status = 'A'
            WHERE
                source_billing IS NOT NULL AND
                system_entry_date IS NOT NULL AND
                state = 'cancel' AND
                fiscal_document_status != 'A';
            """
        )
