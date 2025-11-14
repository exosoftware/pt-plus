##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author

{
    "name": "Portugal - Debit Notes",
    "version": "15.0.5.0.0",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "depends": [
        "ptplus",
        "account_debit_note",
        "ptplus_account_credit_note",
    ],
    "data": [
        "views/account_move_views.xml",
    ],
    "post_init_hook": "post_init_hook",
    "demo": [],
    "auto_install": True,
    "installable": True,
}
