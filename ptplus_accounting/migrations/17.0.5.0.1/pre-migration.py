def migrate(cr, version):
    cr.execute(
        """
            UPDATE ir_model_data
            SET noupdate = FALSE
            WHERE module = 'ptplus_accounting' AND
                  model = 'l10n_pt.account.taxonomy';
        """,
    )
