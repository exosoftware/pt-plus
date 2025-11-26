##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author

{
    "name": "Portugal - Debit Notes",
    "version": "14.0.5.0.0",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "depends": [
        "ptplus",
        "account_debit_note",
    ],
    "post_init_hook": "post_init_hook",
    "demo": [],
    "auto_install": True,
    "installable": True,
}
