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
    "version": "16.0.5.0.1",
    "depends": [
        "point_of_sale",
        "ptplus_account_credit_note",
        "ptplus_sale",
        "ptplus_partner",
    ],
    "data": [
        "views/fiscal_document_views.xml",
        "views/pos_order_views.xml",
        "views/res_config_settings_views.xml",
    ],
    "assets": {
        "point_of_sale.assets": [
            "ptplus_pos/static/src/js/models.js",
            # "ptplus_pos/static/src/js/OrderCancelButton.js",
            "ptplus_pos/static/src/js/OrderReceipt.js",
            "ptplus_pos/static/src/js/PaymentScreen.js",
            "ptplus_pos/static/src/js/ProductScreen.js",
            "ptplus_pos/static/src/js/PtplusPosMixin.js",
            "ptplus_pos/static/src/js/TicketScreen.js",
            "ptplus_pos/static/lib/jsrsasign-all-min.js",
            "web/static/lib/zxing-library/zxing-library.js",
            "ptplus_pos/static/src/xml/Screens/OrderManagementScreen/TicketScreen.xml",
            "ptplus_pos/static/src/xml/Screens/PaymentScreen/PaymentScreen.xml",
            # "ptplus_pos/static/src/xml/Screens/ProductScreen/ControlButtons.xml",
            "ptplus_pos/static/src/xml/receipt.xml",
            "ptplus_pos/static/src/css/pos_receipt.css",
        ],
    },
    "demo": [],
    "post_init_hook": "post_init_hook",
    "auto_install": True,
    "installable": True,
}
