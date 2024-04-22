
def migrate(cr, version):
    """ A fix for the empty document status entries"""
    cr.execute(
        """
        UPDATE account_move
        SET
            fiscal_document_status = 'N'
        WHERE
            fiscal_document_status IS NULL AND
            system_entry_date IS NOT NULL
        """
    )

    cr.execute(
        """
        UPDATE account_payment
        SET
            fiscal_document_status = 'N'
        WHERE
            fiscal_document_status IS NULL AND
            system_entry_date IS NOT NULL
        """
    )
