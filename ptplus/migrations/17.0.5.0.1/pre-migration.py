def migrate(cr, version):
    cr.execute(
        """
            UPDATE ir_config_parameter
            SET key = 'ptplus.subscription_code'
            WHERE key = 'l10n_pt.ptplus_subscription_code' ;
        """
    )
