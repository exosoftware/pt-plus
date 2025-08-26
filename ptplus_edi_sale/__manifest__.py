##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author
{
    "name": "Portugal - Sales B2G and EDI",
    "category": "Accounting/Localizations/EDI",
    "summary": "Portuguese sales extension for B2G and EDI",
    "version": "17.0.1.1.0",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "depends": [
        "ptplus_edi",
        "ptplus_sale",
    ],
    "data": [
        "views/sale_order_views.xml",
        "views/report_sale_order.xml",
    ],
    "installable": True,
    "auto_install": True,
    "application": False,
    "license": "OPL-1",
}
