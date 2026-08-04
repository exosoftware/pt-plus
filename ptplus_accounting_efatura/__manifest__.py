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
    "version": "17.0.5.5.1",
    "depends": ["ptplus_accounting", "ptplus_expense"],
    # opencv-contrib-python-headless is an OPTIONAL runtime dependency, on
    # purpose not declared in external_dependencies: production databases
    # may not ship it yet and its absence must never block an upgrade.
    # Without it the QR code scan is skipped with a warning (see
    # models/account_journal.py); it is only imported by the QR scan
    # subprocess (tools/qr_scan.py), never by the server process.
    "external_dependencies": {
        "python": ["bs4", "requests_html", "pymupdf", "html5lib"],
    },
    "data": [
        "security/ir.model.access.csv",
        "security/efatura_security.xml",
        "views/l10n_pt_account_efatura.xml",
        "views/res_partner_views.xml",
        "views/account_move_views.xml",
        "views/hr_expense_views.xml",
        "views/res_config_views.xml",
        "wizards/l10n_pt_dataport_import_efatura.xml",
        "wizards/l10n_pt_account_move_efatura.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "/ptplus_accounting_efatura/static/src/js/efatura_tree_extend.js",
            "/ptplus_accounting_efatura/static/src/xml/efatura_list_button.xml",
        ],
    },
    "demo": [],
    "installable": True,
    "auto_install": False,
}
