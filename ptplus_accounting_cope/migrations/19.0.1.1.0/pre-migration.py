def migrate(cr, version):
    """data_vencim changed from Boolean to Date and PostgreSQL cannot cast
    boolean to date. The wizard lines are transient, so drop them and the
    column and let the ORM recreate it."""
    cr.execute("DELETE FROM l10n_pt_cope_statement_wizard_line")
    cr.execute(
        """
            ALTER TABLE l10n_pt_cope_statement_wizard_line
            DROP COLUMN IF EXISTS data_vencim
        """
    )
