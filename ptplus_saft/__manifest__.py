##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author

{
    "name": "Portugal - SAF-T PT Statement",
    "version": "19.0.4.5.1",
    "license": "OPL-1",
    "depends": ["ptplus", "ptplus_partner"],
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "data": [
        "security/ir.model.access.csv",
        "data/ir_cron.xml",
        "data/mail_templates.xml",
        "data/saft_element_actions.xml",
        "views/res_config_settings_views.xml",
        "wizards/dataport_export_saft.xml",
        "views/account_move_views.xml",
        "views/account_payment_views.xml",
    ],
    "external_dependencies": {
        "python": [
            "unicodecsv",
        ],
    },
    "installable": True,
    "auto_install": True,
    "application": False,
}
