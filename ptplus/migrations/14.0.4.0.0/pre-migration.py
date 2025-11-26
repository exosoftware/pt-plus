
def migrate(cr, version):
    """ A fix for the wrong simplified invoice AT code"""
    cr.execute(
        """
        UPDATE fiscal_document_type
        SET
            type = 'FS'
        WHERE
            type = 'FA'
        """
    )
