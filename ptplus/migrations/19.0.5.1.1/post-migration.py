import logging

from openupgradelib import openupgrade

_logger = logging.getLogger(__name__)  # pylint: disable=C0103


@openupgrade.migrate()
def migrate(env, version):

    # If column we're dealing with is not around anymore, just leave
    if not env["ir.model.fields"].search(
        [
            ("name", "=", "l10n_pt_sd_tax_type"),
            ("model", "=", "account.tax"),
        ]
    ):
        return

    # Move the code on deprecated field l10n_pt_sd_tax_type into l10n_pt_sd_code_id
    openupgrade.logged_query(
        env.cr,
        """
        UPDATE account_tax
        SET l10n_pt_sd_code_id = l10n_pt_stamp_duty_code.id
        FROM l10n_pt_stamp_duty_code
        WHERE account_tax.l10n_pt_sd_tax_type = l10n_pt_stamp_duty_code.code AND
              account_tax.l10n_pt_sd_tax_type IS NOT NULL AND
              account_tax.l10n_pt_sd_tax_type != 'ISE';
        """,
    )
    openupgrade.logged_query(
        env.cr,
        """
        UPDATE account_tax
        SET l10n_pt_sd_code_id = NULL
        WHERE l10n_pt_sd_tax_type = 'ISE';
        """,
    )

    # Clear the obsolete field for good
    env.cr.execute(
        "UPDATE account_tax SET l10n_pt_sd_tax_type = NULL "
        "WHERE l10n_pt_sd_tax_type IS NOT NULL;"
    )
