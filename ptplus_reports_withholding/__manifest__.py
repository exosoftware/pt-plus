##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author
{
    "name": "Portugal - Withholding Tax Statements",
    "version": "19.0.1.3.0",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Accounting/Localizations/Reporting",
    "depends": [
        "ptplus_reports",
    ],
    "data": [
        "security/ir.model.access.csv",
        "report/l10n_pt_report_annual_statement.xml",
        "views/l10n_pt_report_annual_statement.xml",
        "data/mail_templates.xml",
        "views/res_partner.xml",
        "wizards/l10n_pt_annual_statement_wizard.xml",
        "wizards/l10n_pt_monthly_statement_wizard.xml",
        "wizards/l10n_pt_mod10_statement_wizard.xml",
        "wizards/l10n_pt_mod30_statement_wizard.xml",
    ],
    "demo": [],
    "auto_install": False,
    "installable": True,
}
