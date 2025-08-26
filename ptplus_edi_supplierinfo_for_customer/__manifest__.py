##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author
{
    "name": "Portugal - Customer product codes on CIUS-PT",
    "category": "Accounting/Localizations/EDI",
    "summary": "Extend Portuguese EDI to include customer product codes.",
    "version": "17.0.1.1.0",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "depends": ["ptplus_edi", "product_supplierinfo_for_customer_invoice", ],
    "data": [
        "data/cius_pt_211_templates.xml",
    ],
    "installable": False,
    "auto_install": True,
    "application": False,
    "license": "AGPL-3",
}
