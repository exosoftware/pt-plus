def migrate(cr, version):
    # The legacy "extraction" computing method is no longer selectable;
    # move any company still using it to the default "real-time" method.
    cr.execute(
        """
        UPDATE res_company
        SET l10n_pt_saft_computing_method = 'real-time'
        WHERE l10n_pt_saft_computing_method = 'extraction'
        """
    )
