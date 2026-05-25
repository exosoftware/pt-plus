##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author

{
    "name": "Portugal - Accounting Enterprise",
    "version": "19.0.1.0.0",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "depends": ["ptplus", "account_reports"],
    "data": [
        "data/trial_balance.xml",
        "data/trial_balance_expressions.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "ptplus_accounting_enterprise/static/src/components/**/*"
        ],
    },
    "auto_install": True,
    "installable": True,
}
