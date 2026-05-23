def migrate(cr, version):
    cr.execute(
        """
            UPDATE ir_model_data
            SET noupdate = FALSE
            WHERE module = 'ptplus' AND
                  model = 'account.account.tag';
        """,
    )
