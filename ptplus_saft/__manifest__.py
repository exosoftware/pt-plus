##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author

{
    "name": "Portugal - SAF-T PT Statement",
    "version": "18.0.4.4.1",
    "license": "OPL-1",
    "depends": ["bus", "ptplus", "ptplus_partner"],
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "data": [
        "security/ir.model.access.csv",
        "data/ir_cron.xml",
        "data/mail_templates.xml",
        "data/saft_element_actions.xml",
        "views/l10n_pt_account_saft_import.xml",
        "views/res_config_settings_views.xml",
        "wizards/dataport_export_saft.xml",
        "views/l10n_pt_import_saft_configuration.xml",
        "views/res_partner_views.xml",
        "views/product_template_views.xml",
        "views/account_account_views.xml",
        "views/account_journal_views.xml",
        "views/account_move_views.xml",
        "views/account_payment_views.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "ptplus_saft/static/src/js/saft_import_progress_field.js",
        ],
    },
    "external_dependencies": {
        "python": [
            "unicodecsv",
        ],
    },
    "installable": True,
    "auto_install": True,
    "application": False,
}
