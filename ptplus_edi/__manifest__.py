##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author
{
    "name": "Portugal - E-invoicing CIUS-PT",
    "category": "Accounting/Localizations/EDI",
    "summary": "Portuguese e-invoicing (CIUS-PT)",
    "version": "19.0.1.2.0",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "depends": [
        "ptplus",
        "ptplus_partner",
        "ptplus_account_credit_note",
        "account_edi_ubl_cii",
        "sale",
    ],
    "data": [
        "views/account_move_views.xml",
        "views/report_invoice.xml",
        "views/res_config_settings_views.xml",
    ],
    "installable": True,
    "application": False,
    "license": "OPL-1",
}
