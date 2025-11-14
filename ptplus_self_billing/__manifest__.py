##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author

{
    "name": "Portugal - Self-billing",
    "version": "15.0.4.1.0",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "depends": [
        "ptplus", "ptplus_saft",
    ],
    "data": [
        "data/fiscal_document.xml",
        "views/report_templates.xml",
        "views/report_invoice.xml",
        "views/res_partner_views.xml",
        "views/fiscal_document_views.xml",
        "views/account_move_views.xml",
        "wizards/dataport_export_saft.xml",
    ],
    "assets": {
        "web.report_assets_common": [
            "ptplus_self_billing/static/src/scss/layout_self_billing.scss",
        ],
    },
    "demo": [],
    "auto_install": False,
    "installable": True,
}
