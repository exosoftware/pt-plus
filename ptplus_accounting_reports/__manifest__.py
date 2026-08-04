##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author
{
    "name": "Portugal - Accounting Reports & Statements",
    "version": "17.0.1.2.0",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Accounting/Localizations/Reporting",
    "depends": ["ptplus_reports", "ptplus_accounting"],
    "data": [
        "security/ir.model.access.csv",
        "wizards/l10n_pt_trial_balance_wizard.xml",
        "wizards/l10n_pt_balance_sheet_wizard.xml",
        "wizards/l10n_pt_profit_loss_wizard.xml",
        "wizards/l10n_pt_monthly_stamp_duty_statement_wizard.xml",
        "wizards/l10n_pt_exploration_map_wizard_views.xml",
    ],
    "demo": [],
    "auto_install": False,
    "installable": True,
}
