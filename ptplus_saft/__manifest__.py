##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author

{
    "name": "Portugal - SAF-T PT Statement",
    "version": "18.0.4.1.0",
    "license": "OPL-1",
    "depends": ["ptplus", "ptplus_partner"],
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "data": [
        "security/ir.model.access.csv",
        "data/ir_cron.xml",
        "data/mail_templates.xml",
        "views/l10n_pt_account_saft_import.xml",
        "views/res_config_settings_views.xml",
        "wizards/dataport_export_saft.xml",
        "wizards/dataport_import_saft.xml",
        "wizards/l10n_pt_import_saft_configuration.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "ptplus_saft/static/src/js/saft_tree_extend.js",
            "ptplus_saft/static/src/xml/saft_list_button.xml",
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
