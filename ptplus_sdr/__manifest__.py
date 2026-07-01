##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
{
    "name": "Portugal - SDR / Volta",
    "category": "Accounting/Localizations",
    "summary": "Sistema de Depósito e Reembolso (deposit return scheme)",
    "version": "18.0.1.0.0",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "license": "OPL-1",
    "depends": [
        "ptplus",
    ],
    "data": [
        "data/product_data.xml",
        "views/product_views.xml",
        "views/account_move_views.xml",
        "views/res_config_views.xml",
    ],
    "post_init_hook": "post_init_hook",
    "installable": True,
    "application": False,
    "auto_install": False,
}
