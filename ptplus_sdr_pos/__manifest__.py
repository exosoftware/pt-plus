##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
{
    "name": "Portugal - SDR / Volta on PoS",
    "category": "Accounting/Localizations",
    "summary": "Auto-build the SDR / Volta deposit line on PoS orders",
    "version": "19.0.1.0.0",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "license": "OPL-1",
    "depends": [
        "ptplus_sdr",
        "ptplus_pos",
    ],
    "data": [
        "data/product_data.xml",
    ],
    "assets": {
        "point_of_sale._assets_pos": [
            "ptplus_sdr_pos/static/src/**/*",
        ],
    },
    "installable": True,
    "application": False,
    "auto_install": True,
}
