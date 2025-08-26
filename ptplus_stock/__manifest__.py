##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author
{
    "name": "Portugal - Stock",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "version": "17.0.5.0.2",
    "depends": [
        "ptplus_saft",
        "stock_picking_invoice_link",
    ],
    "data": [
        "security/ir.model.access.csv",
        "data/stock_picking_mail.xml",
        "report/deliveryslip_report.xml",
        "views/res_config_settings_views.xml",
        "views/report_deliveryslip.xml",
        "views/report_invoice.xml",
        "views/stock_picking_views.xml",
        "views/product_views.xml",
        "views/fiscal_document_views.xml",
        # "wizards/webservice_failure.xml",
        "wizards/wizard_inventory_statement.xml",
    ],
    "external_dependencies": {"python": ["unicodecsv"]},
    "demo": [],
    "post_init_hook": "post_init_hook",
    "installable": True,
}
