##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
{
    "name": "Portugal - SDR / Volta on Sales",
    "category": "Accounting/Localizations",
    "summary": "Auto-build the SDR / Volta deposit line on sales orders",
    "version": "18.0.1.0.0",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "license": "OPL-1",
    "depends": [
        "ptplus_sdr",
        "ptplus_sale",
    ],
    "data": [
        "data/product_data.xml",
        "views/sale_order_views.xml",
    ],
    "installable": True,
    "application": False,
    "auto_install": True,
}
