from openupgradelib import openupgrade


@openupgrade.migrate()
def migrate(env, version):
    openupgrade.logged_query(
        env.cr,
        """
            UPDATE ir_config_parameter
            SET key = 'ptplus.subscription_code'
            WHERE key = 'l10n_pt.ptplus_subscription_code' ;
        """,
    )
