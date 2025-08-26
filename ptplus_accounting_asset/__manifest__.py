##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=manifest-required-author
{
    "name": "Portugal - Asset EE",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Accounting & Finance",
    "version": "18.0.5.1.0",
    "depends": ["account_asset", "ptplus_accounting_tax_statement"],
    "data": [
        "views/account_asset_legal_rate_views.xml",
        "views/account_asset_views.xml",
    ],
    "demo": [],
    "installable": True,
    "auto_install": True,
}
