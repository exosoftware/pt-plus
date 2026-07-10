##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author

{
    "name": "Portugal - Credit Notes",
    "version": "19.0.5.0.1",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "depends": ["ptplus", "ptplus_saft"],
    "data": [
        "views/account_move_views.xml",
    ],
    "post_init_hook": "post_init_hook",
    "demo": [],
    "auto_install": True,
    "installable": True,
}
