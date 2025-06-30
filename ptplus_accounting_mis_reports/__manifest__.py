##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author
{
    "name": "Portugal - Management Reports",
    "version": "14.0.5.0.0",
    "license": "AGPL-3",
    "depends": ["ptplus_accounting", "mis_builder"],
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "data": [
        "data/mis_report_styles.xml",
        "data/mis_report_trial_balance.xml",
        "views/mis_report_views.xml",
    ],
    "installable": True,
    "auto_install": True,
    "application": False,
}
