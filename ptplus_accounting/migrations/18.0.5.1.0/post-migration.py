import logging

from openupgradelib import openupgrade
from psycopg2.errors import UndefinedColumn, UndefinedTable

_logger = logging.getLogger(__name__)  # pylint: disable=C0103


@openupgrade.migrate()
def migrate(env, version):
    try:
        env.cr.execute("SELECT prefix FROM l10n_pt_account_taxonomy_prefix;")
    except (UndefinedColumn, UndefinedTable):
        return

    account_ids = (
        env["account.account"]
        .with_context(active_test=False)
        .search(
            [
                ("l10n_pt_taxonomy_id", "!=", False),
            ]
        )
    )

    for account in account_ids:
        env.cr.execute(
            "SELECT account_prefix FROM l10n_pt_account_taxonomy WHERE id = %s;",
            (account.l10n_pt_taxonomy_id.id,),
        )
        account_prefix = env.cr.fetchone()[0]

        env.cr.execute(
            f"""
            SELECT l10n_pt_account_taxonomy.id, l10n_pt_account_taxonomy_prefix.id
            FROM l10n_pt_account_taxonomy_prefix
            JOIN l10n_pt_account_taxonomy
              ON l10n_pt_account_taxonomy.id = l10n_pt_account_taxonomy_prefix.taxonomy_id
            WHERE l10n_pt_account_taxonomy_prefix.prefix = '{account_prefix}'
              AND l10n_pt_account_taxonomy.reference = '{account.l10n_pt_taxonomy_id.reference}'
              AND l10n_pt_account_taxonomy.code = '{account.l10n_pt_taxonomy_id.code}';
            """,
        )
        new_taxonomies = env.cr.fetchall()
        if len(new_taxonomies) != 1:
            logging.warning("No taxonomies match found")
            account.l10n_pt_taxonomy_id = False
        else:
            account.l10n_pt_taxonomy_id = new_taxonomies[0][0]
