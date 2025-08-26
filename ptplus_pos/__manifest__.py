##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author
{
    "name": "Portugal - POS",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "version": "17.0.5.0.1",
    "depends": ["point_of_sale", "ptplus_account_credit_note", "ptplus_sale"],
    "data": [
        "views/fiscal_document_views.xml",
        "views/pos_order_views.xml",
        "views/res_config_settings_views.xml",
    ],
    "assets": {
        "point_of_sale._assets_pos": [
            "ptplus_pos/static/src/**/*",
            "ptplus_pos/static/lib/*",
        ],
    },
    "demo": [],
    "post_init_hook": "post_init_hook",
    "auto_install": True,
    "installable": True,
}
