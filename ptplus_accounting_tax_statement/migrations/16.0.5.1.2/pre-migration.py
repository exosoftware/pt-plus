from openupgradelib import openupgrade

set_to_update = ["wizard_tax_statement_form"]

xmlids = [
    (
        "ptplus_accounting_tax_statement.common_wizard_statement_form",
        "ptplus_accounting_tax_statement.common_wizard_statement_Form",
    ),
]


@openupgrade.migrate()
def migrate(env, version):
    """This migration is just to force an update on this view, and prevent an error"""
    openupgrade.set_xml_ids_noupdate_value(
        env, "ptplus_accounting_tax_statement", set_to_update, False
    )
    openupgrade.rename_xmlids(env.cr, xmlids)
