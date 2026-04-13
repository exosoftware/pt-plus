##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author
{
    "name": "Portugal - E-invoicing CIUS-PT",
    "category": "Accounting/Localizations/EDI",
    "summary": "Portuguese e-invoicing (CIUS-PT 2.1.1)",
    "version": "16.0.1.1.0",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "depends": ["ptplus", "ptplus_partner", "account_edi_ubl_cii", "sale"],
    "data": [
        "data/cius_pt_211_templates.xml",
        "data/account_edi_data.xml",
        "views/account_move_views.xml",
        "views/report_invoice.xml",
        "views/res_partner_views.xml",
        "views/res_config_settings_views.xml",
    ],
    "installable": True,
    "application": False,
    "license": "OPL-1",
}
