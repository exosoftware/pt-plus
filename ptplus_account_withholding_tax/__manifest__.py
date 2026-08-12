##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
{
    "name": "Portugal - Withholding Tax on Payment",
    "category": "Accounting/Localizations",
    "summary": "Portuguese localization for withholding tax on payments",
    "version": "19.0.1.0.0",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "license": "OPL-1",
    "depends": [
        "ptplus_saft",
        "l10n_account_withholding_tax",
    ],
    "data": [
        "views/report_invoice.xml",
    ],
    "installable": True,
    "application": False,
    "auto_install": True,
}
