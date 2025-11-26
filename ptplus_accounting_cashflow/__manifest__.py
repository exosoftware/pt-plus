##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author
{
    "name": "Portugal - Cash Flow",
    "version": "14.0.4.0.0",
    "license": "OPL-1",
    "depends": ["ptplus_accounting"],
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "data": [
        "security/ir.model.access.csv",
        "data/account_cashflow.xml",
        "views/account_cashflow.xml",
        "views/account_views.xml",
        "views/account_payment_views.xml",
        "views/account_bank_statement_views.xml",
        "views/res_config_views.xml",
    ],
    "installable": False,
    "auto_install": False,
    "application": False,
}
