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
    "version": "14.0.4.2.0",
    "depends": ["point_of_sale", "ptplus_saft"],
    "data": [
        "views/pos_templates.xml",
        "views/pos_order_views.xml",
        "views/pos_config_views.xml",
        "views/fiscal_document_views.xml",
    ],
    "qweb": [
        "static/src/xml/receipt.xml",
        "static/src/xml/Screens/OrderManagementScreen/OrderRow.xml",
        "static/src/xml/Screens/OrderManagementScreen/OrderList.xml",
    ],
    "demo": [],
    "post_init_hook": "post_init_hook",
    "auto_install": False,
    "installable": False,
}
