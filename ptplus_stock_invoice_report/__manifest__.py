##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################
# pylint: disable=license-allowed, manifest-required-author
{
    'name': "Portugal - Stock Invoice Report",
    'license': 'OPL-1',
    'author': 'Exo Software',
    'website': 'https://exosoftware.pt',
    'category': 'Localization',
    'version': '14.0.4.0.0',
    'depends': ['ptplus_stock', ],
    'data': [
        "report/deliveryslip_report.xml",
        "views/assets.xml",
        "views/res_config_views.xml",
        "views/report_invoice.xml",

    ],
    'installable': False, # was already false
}
