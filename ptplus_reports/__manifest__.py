##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author
{
    "name": "Portugal - Statements/Reports",
    "version": "18.0.1.3.2",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Accounting/Localizations/Reporting",
    "depends": [
        "ptplus",
    ],
    "data": [
        "security/ir.model.access.csv",
        "views/res_partner.xml",
        "views/res_users_views.xml",
        "views/menu.xml",
        "wizards/l10n_pt_statement_wizard.xml",
        "wizards/l10n_pt_multi_statement_wizard.xml",
        "data/mail_template_at_document.xml",
    ],
    "demo": [],
    "auto_install": False,
    "installable": True,
}
