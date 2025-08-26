##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author

{
    "name": "Portugal - Partner",
    "version": "17.0.4.1.1",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "depends": [
        "base",
        "ptplus",
    ],
    "data": [
        "data/res_bank.xml",
        "data/res_partner.xml",
        "data/hr_tax_office_pt.xml",
        "security/ir.model.access.csv",
        "views/res_partner_views.xml",
        "views/res_config_settings_views.xml",
        "views/hr_tax_office_pt_views.xml",
        "wizards/address_selection_ctt.xml",
    ],
    "demo": [],
    "auto_install": True,
    "installable": True,
}
