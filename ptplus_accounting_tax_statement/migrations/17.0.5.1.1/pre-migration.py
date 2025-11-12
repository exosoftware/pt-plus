def migrate(cr, version):
    """This migration is just to force an update on this view, and prevent an error"""
    cr.execute(
        """
            UPDATE ir_model_data
            SET noupdate=false
            WHERE module = 'ptplus_accounting_tax_statement'
            AND name = 'common_wizard_statement_form'
        """
    )
