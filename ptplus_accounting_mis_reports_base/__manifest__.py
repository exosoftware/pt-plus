##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author
{
    "name": "Portugal - Management Reports (Base)",
    "version": "17.0.4.0.1",
    "license": "AGPL-3",
    "depends": ["ptplus_accounting_mis_reports"],
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "data": [
        "data/mis_report_profit_loss.xml",
        "data/mis_report_balance_sheet.xml",
        "data/mis_report_balance_control.xml",
    ],
    "installable": True,
    "auto_install": False,
    "application": False,
}
