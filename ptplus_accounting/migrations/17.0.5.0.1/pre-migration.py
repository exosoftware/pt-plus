from openupgradelib import openupgrade


@openupgrade.migrate()
def migrate(env, version):

    openupgrade.logged_query(
        env.cr,
        """
            UPDATE ir_model_data
            SET noupdate = FALSE
            WHERE module = 'ptplus_accounting' AND
                  model = 'l10n_pt.account.taxonomy';
        """,
    )
