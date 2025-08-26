##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author
{
    "name": "Portugal - Sale",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "version": "18.0.5.0.2",
    "depends": ["sale_management", "ptplus_saft"],
    "data": [
        "data/ir_sequence.xml",
        "views/sale_order_views.xml",
        "views/res_config_views.xml",
        "views/report_sale_order.xml",
        "report/sale_order_report.xml",
    ],
    "demo": [],
    "post_init_hook": "post_init_hook",
    "auto_install": True,
    "installable": True,
}
