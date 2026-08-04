import logging

from openupgradelib import openupgrade

_logger = logging.getLogger(__name__)  # pylint: disable=C0103

TABLE = "l10n_pt_account_efatura_tax_mapping"
REL_TABLE = "l10n_pt_efatura_tax_mapping_partner_rel"
LEGACY_RATE = openupgrade.get_legacy_name("tax_percentage")


@openupgrade.migrate()
def migrate(env, version):
    if not openupgrade.table_exists(env.cr, TABLE):
        return
    _migrate_rate(env)
    _migrate_partner(env)


def _migrate_rate(env):
    """tax_percentage went from float to char, so that a mapping can be left
    without a rate and match any of them. Keep the rates already configured,
    written the way a user would type them."""
    if not openupgrade.column_exists(env.cr, TABLE, "tax_percentage"):
        return
    openupgrade.rename_columns(env.cr, {TABLE: [("tax_percentage", None)]})
    env.cr.execute(f"ALTER TABLE {TABLE} ADD COLUMN tax_percentage varchar")
    # to_char pins the two decimals before the zeros are trimmed: casting
    # straight to text would turn a rate of 20 into "20" and then into "2"
    openupgrade.logged_query(
        env.cr,
        f"""
        UPDATE {TABLE}
        SET tax_percentage = trim(trailing '.' from trim(
            trailing '0' from to_char({LEGACY_RATE}, 'FM999999990.00')
        ))
        WHERE {LEGACY_RATE} IS NOT NULL
        """,
    )


def _migrate_partner(env):
    """partner_id became partner_ids, so that one mapping can cover several
    vendors: move the vendor already set into the relation table."""
    if not openupgrade.column_exists(env.cr, TABLE, "partner_id"):
        return
    openupgrade.logged_query(
        env.cr,
        f"""
        CREATE TABLE IF NOT EXISTS {REL_TABLE} (
            mapping_id integer NOT NULL,
            partner_id integer NOT NULL,
            PRIMARY KEY (mapping_id, partner_id)
        )
        """,
    )
    openupgrade.logged_query(
        env.cr,
        f"""
        INSERT INTO {REL_TABLE} (mapping_id, partner_id)
        SELECT id, partner_id FROM {TABLE} WHERE partner_id IS NOT NULL
        ON CONFLICT DO NOTHING
        """,
    )
    openupgrade.drop_columns(env.cr, [(TABLE, "partner_id")])
