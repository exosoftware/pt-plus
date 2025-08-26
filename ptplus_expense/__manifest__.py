##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exo.pt>)
#
##############################################################################

{
    "name": "Portugal - Expenses",
    "version": "17.0.1.1.1",
    "license": "OPL-1",
    "depends": ["hr_expense", "sale_expense"],
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Localization",
    "data": [
        "data/product.xml",
        "report/hr_expense_report.xml",
        "views/res_partner_views.xml",
        "views/hr_expense_views.xml",
        "views/hr_employee_views.xml",
        "views/product_views.xml",
    ],
    "installable": True,
    "auto_install": False,
    "application": False,
}
