##############################################################################
#
#   Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author

{
    "name": "Portugal - Invoice grouped by picking",
    "version": "15.0.4.0.0",
    "license": "LGPL-3",
    "depends": ["account_invoice_report_grouped_by_picking", "ptplus_stock"],
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Extra Tools",
    "data": [
        "views/report_invoice.xml",
    ],
    "installable": False,
    "auto_install": True,
    "application": False,
}
