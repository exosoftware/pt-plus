##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author
{
    "name": "Portugal - POS Restaurnat",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "version": "19.0.1.1.0",
    "depends": ["ptplus_pos", "pos_restaurant"],
    "data": [
        "views/pos_order_views.xml",
        "views/res_config_settings_views.xml",
    ],
    "assets": {
        "point_of_sale._assets_pos": [
            "ptplus_pos_restaurant/static/src/**/*",
        ],
    },
    "demo": [],
    "post_init_hook": "post_init_hook",
    "auto_install": True,
    "installable": True,
}
