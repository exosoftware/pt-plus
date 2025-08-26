##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author

{
    "name": "Portugal - Self-billing",
    "version": "17.0.5.0.0",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "depends": ["ptplus", "ptplus_saft", "ptplus_account_credit_note"],
    "data": [
        "security/ir.model.access.csv",
        "data/fiscal_document.xml",
        "views/report_templates.xml",
        "views/report_invoice.xml",
        "views/res_partner_views.xml",
        "views/fiscal_document_views.xml",
        "views/account_move_views.xml",
        "wizards/dataport_export_saft.xml",
        "wizards/webservice_series_comm.xml",
        "wizards/l10n_pt_partner_saft_mail.xml",
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
