##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=manifest-required-author

{
    "name": "Portugal - Cash Flow MIS Report",
    "version": "15.0.4.0.0",
    "license": "AGPL-3",
    "depends": ["mis_builder", "ptplus_accounting_cashflow"],
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "data": [
        "data/mis_report_styles.xml",
        "data/mis_report_cashflow.xml",
    ],
    "installable": False,
    "auto_install": True,
    "application": False,
}
