##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author
{
    "name": "Portugal - Saphety EDI",
    "category": "Accounting/Localizations/EDI",
    "summary": "Transmit your e-invoices to the Saphety EDI platform",
    "version": "17.0.5.0.0",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "depends": ["ptplus_edi"],
    "data": [
        "data/account_edi_data.xml",
        "views/res_config_settings_views.xml",
        "views/account_edi_document_views.xml",
        "views/account_move_views.xml",
        "data/ir_cron.xml",
    ],
    "installable": False,
    "application": False,
    "license": "OPL-1",
}
