##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author
{
    "name": "Portugal - E-Fatura",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "version": "17.0.5.11.1",
    "depends": ["ptplus_accounting", "ptplus_expense"],
    # opencv-contrib-python-headless is an OPTIONAL runtime dependency, on
    # purpose not declared in external_dependencies: production databases
    # may not ship it yet and its absence must never block an upgrade.
    # Without it the QR code scan is skipped with a warning (see
    # models/account_journal.py); it is only imported by the QR scan
    # subprocess (tools/qr_scan.py), never by the server process.
    "external_dependencies": {
        "python": ["pymupdf"],
    },
    "post_init_hook": "post_init_hook",
    "data": [
        "security/ir.model.access.csv",
        "data/ir_cron.xml",
        "security/efatura_security.xml",
        "views/l10n_pt_account_efatura_tax_mapping.xml",
        # Before the e-fatura views: the document form links to this wizard's
        # action, which has to exist by then
        "wizards/l10n_pt_account_move_efatura.xml",
        "wizards/l10n_pt_account_efatura_merge.xml",
        "views/l10n_pt_account_efatura.xml",
        "views/res_partner_views.xml",
        "views/account_move_views.xml",
        "views/hr_expense_views.xml",
        "views/res_config_views.xml",
        "wizards/l10n_pt_dataport_import_efatura.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "/ptplus_accounting_efatura/static/src/js/efatura_tree_extend.js",
            "/ptplus_accounting_efatura/static/src/js/efatura_sync_stage_field.js",
            "/ptplus_accounting_efatura/static/src/js/efatura_mapping_missing_field.js",
            "/ptplus_accounting_efatura/static/src/xml/efatura_list_button.xml",
            "/ptplus_accounting_efatura/static/src/xml/efatura_mapping_missing_field.xml",
        ],
    },
    "demo": [],
    "installable": True,
    "auto_install": False,
}
