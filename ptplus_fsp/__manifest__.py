##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author

{
    "name": "Portugal - Fatura Sem Papel",
    "version": "19.0.0.0.1",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Accounting/Localizations/EDI",
    "summary": "Send invoices via Fatura Sem Papel (FSP/ARTE)",
    "depends": ["ptplus", "account_edi"],
    "data": [
        "security/fsp_security.xml",
        "data/account_edi_format_fsp.xml",
        "data/ir_cron.xml",
        "views/account_move_views.xml",
        "views/res_config_settings_views.xml",
    ],
    "external_dependencies": {
        "python": ["requests", "cryptography", "asn1crypto", "pyzipper"]
    },
    "post_init_hook": "post_init_hook",
    "installable": True,
    "application": False,
    "demo": [],
}
