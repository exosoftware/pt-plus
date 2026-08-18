##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exo.pt>)
#
##############################################################################

{
    "name": "Portugal - Expenses",
    "version": "19.0.1.4.0",
    "license": "OPL-1",
    "depends": ["hr_expense", "sale_expense", "ptplus"],
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "data": [
        "data/product.xml",
        "report/hr_expense_report.xml",
        "views/res_partner_views.xml",
        "views/account_move_views.xml",
        "views/hr_expense_views.xml",
        "views/hr_employee_views.xml",
        "views/product_views.xml",
        "views/res_config_views.xml",
    ],
    "installable": True,
    "auto_install": True,
    "application": False,
}
