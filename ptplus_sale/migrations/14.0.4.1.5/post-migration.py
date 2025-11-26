
def migrate(cr, version):
    """ A fix for the empty document status entries"""
    cr.execute(
        """
        UPDATE sale_order
        SET
            fiscal_document_status = 'N'
        WHERE
            fiscal_document_status IS NULL AND
            system_entry_date IS NOT NULL
        """
    )
