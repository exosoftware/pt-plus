##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author

{
    "name": "Portugal - Full Accounting",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "version": "18.0.5.0.3",
    "depends": [
        "account",
        "ptplus",
        "ptplus_account_credit_note",
        "ptplus_account_debit_note",
    ],
    "data": [
        "data/l10n_pt_account_vat_adjustment_norm_data.xml",
        "data/l10n_pt_account_taxonomy_data.xml",
        "data/l10n_pt.account.asset.legal_rate.csv",
        "security/ir.model.access.csv",
        "security/accounting_security.xml",
        "views/account_balance_transfer.xml",
        "views/l10n_pt_account_taxonomy.xml",
        "views/account_account_views.xml",
        "views/account_journal_views.xml",
        "views/l10n_pt_account_vat_adjustment_norm.xml",
        "views/account_move_views.xml",
        "views/account_move_line_views.xml",
        "views/report_account_move.xml",
        "views/l10n_pt_account_asset_legal_rate.xml",
        "report/account_move_report.xml",
        "wizards/l10n_pt_account_taxonomy_setup_wizard.xml",
        # "wizards/account_invoice_refund_views.xml",
        "wizards/account_move_reversal_views.xml",
        "wizards/account_debit_note_views.xml",
    ],
    "post_init_hook": "post_init_hook",
    "demo": [],
    "installable": True,
}
