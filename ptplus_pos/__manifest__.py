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
    "version": "15.0.4.2.0",
    "depends": ["point_of_sale", "ptplus_saft"],
    "data": [
        "views/pos_order_views.xml",
        "views/pos_config_views.xml",
        "views/fiscal_document_views.xml",
    ],
    "assets": {
        "web.assets_qweb": [
            "ptplus_pos/static/src/xml/receipt.xml",
            "ptplus_pos/static/src/xml/Screens/OrderManagementScreen/TicketScreen.xml",
        ],
        "point_of_sale.assets": [
            "ptplus_pos/static/src/js/models.js",
            "ptplus_pos/static/src/js/PaymentScreen.js",
            "ptplus_pos/static/lib/jsrsasign-all-min.js",
            "ptplus_pos/static/src/css/pos_receipt.css",
            "web/static/lib/zxing-library/zxing-library.js",
        ],
    },

    "demo": [],
    "post_init_hook": "post_init_hook",
    "auto_install": True,
    "installable": True,
}
