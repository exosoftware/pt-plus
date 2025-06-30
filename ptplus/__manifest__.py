##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author

{
    "name": "Portugal - Invoicing",
    "version": "15.0.5.0.1",
    "license": "OPL-1",
    "depends": [
        "base_vat",
        "account",
        "l10n_pt",
        "bus"
    ],
    "excludes": [
    ],
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "summary": "Portuguese Invoices & Payments",
    "data": [
        "security/ir.model.access.csv",
        "security/security.xml",
        "data/account_chart_template.xml",
        "data/account_account_data.xml",
        "data/account.account.template-common.csv",
        "data/account.account.template-micro.csv",
        "data/account.account.template-base.csv",
        "data/account.account.template-esnl.csv",
        "data/account_chart_template_accounts.xml",
        "data/account_tax_data.xml",
        "data/res_country.xml",
        "data/account_fiscal_position.xml",
        "data/account_chart_template_init.xml",
        "data/account_group_data.xml",
        "views/account_views.xml",
        "views/dataport_log.xml",
        "views/layout.xml",
        "views/fiscal_document.xml",
        "views/account_tax_views.xml",
        "views/account_tax_group_views.xml",
        "views/res_company_views.xml",
        "views/res_config_views.xml",
        "views/account_move_views.xml",
        "views/product_views.xml",
        "views/res_users_views.xml",
        "views/account_payment_views.xml",
        "views/report_payment.xml",
        "views/report_templates.xml",
        # "wizards/account_invoice_debit.xml",
        "report/invoice_report.xml",
        "views/report_invoice.xml",
        "report/payment_report.xml",
        "wizards/dataport_import.xml",
        "wizards/dataport_export.xml",
        "wizards/webservice_failure.xml",
        "wizards/webservice_series_comm.xml",
    ],
    "external_dependencies": {
        "python": ["xmlschema", "unicodecsv", "zeep"],
    },
    "assets": {
        "web.report_assets_common": [
            "ptplus/static/src/scss/layout.scss",
        ],
        "web.assets_backend": [
            "ptplus/static/src/scss/backend.scss",
            "ptplus/static/src/js/services/*",
        ],
    },
    "post_init_hook": "post_init_hook",
    "installable": True,
    "auto_install": False,
    "application": False,
}
