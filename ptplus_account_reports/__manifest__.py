##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author

{
    "name": "Portugal - Account Reports",
    "version": "14.0.4.0.0",
    "license": "OPL-1",
    "author": "Exo Software",
    'website': "https://exosoftware.pt",
    "category": "Localization",
    "depends": ["base", "ptplus"],
    "data": [
        "report/overdue_report.xml",
        "views/report_partner_balance.xml",
        "views/report_partner_outstanding.xml",
        "data/partner_mail.xml",
        "views/report_templates.xml",
        "wizards/report_partner_balance_wizard_view.xml",
        "wizards/report_partner_outstanding_wizard_view.xml",
    ],
    "demo": [],
    'auto_install': False,
    "installable": False,
}
