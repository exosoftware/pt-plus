##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author
{
    "name": "Portugal - Tax Statements",
    "version": "18.0.5.1.4",
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
        "data/l10n_pt.account.statement.line.csv",
        "views/l10n_pt_account_statement_template.xml",
        "views/l10n_pt_account_statement.xml",
        "views/dataport_log.xml",
        "wizards/l10n_pt_wizard_statement.xml",
        "wizards/l10n_pt_wizard_recap_statement.xml",
    ],
    "demo": [],
    "auto_install": False,
    "installable": True,
}
