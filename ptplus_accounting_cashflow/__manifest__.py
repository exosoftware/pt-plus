##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author
{
    "name": "Portugal - Cash Flow",
    "version": "19.0.5.2.0",
    "license": "OPL-1",
    "depends": ["ptplus_accounting_reports"],
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "data": [
        "security/security.xml",
        "security/ir.model.access.csv",
        "data/l10n_pt_cashflow_category_data.xml",
        "data/l10n_pt_cashflow_distribution_model_data.xml",
        "views/l10n_pt_cashflow_category_views.xml",
        "views/l10n_pt_cashflow_distribution_model_views.xml",
        "views/account_move_views.xml",
        "views/account_move_line_views.xml",
        "wizards/l10n_pt_cash_flow_statement_wizard.xml",
        "wizards/l10n_pt_cashflow_backfill_wizard.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "ptplus_accounting_cashflow/static/src/**/*",
        ],
    },
    "pre_init_hook": "pre_init_hook",
    "installable": True,
    "auto_install": False,
    "application": False,
}
