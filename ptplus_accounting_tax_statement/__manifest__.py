##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author
{
    "name": "Portugal - Tax Statements",
    "version": "14.0.5.0.1",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "depends": [
        "ptplus_accounting",
    ],
    "data": [
        "security/ir.model.access.csv",
        "data/tax_statement_data.xml",
        "data/l10n_pt.account.tax.statement.line.csv",
        "views/l10n_pt_account_tax_statement_template.xml",
        "views/l10n_pt_account_tax_statement.xml",
        "views/dataport_log.xml",
        "wizards/l10n_pt_wizard_tax_statement.xml",
        "wizards/l10n_pt_wizard_recap_statement.xml",
    ],
    "demo": [],
    "auto_install": False,
    "installable": True,
}
