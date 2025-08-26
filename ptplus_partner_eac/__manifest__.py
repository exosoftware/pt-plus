##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author

{
    "name": "Portugal - Partner EAC",
    "version": "17.0.5.0.0",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "depends": [
        "ptplus_partner",
        "contacts",
    ],
    "data": [
        "security/company_eac.xml",
        "data/economic_activities.xml",
        "views/l10n_pt_company_eac.xml",
        "views/res_company_views.xml",
        "views/res_partner_views.xml",
    ],
    "demo": [],
    "auto_install": True,
    "installable": True,
}
