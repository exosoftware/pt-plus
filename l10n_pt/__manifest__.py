# Part of Odoo. See LICENSE file for full copyright and licensing details.

# Copyright (C) 2012 Thinkopen Solutions, Lda. All Rights Reserved
# http://www.thinkopensolutions.com.

{
    "name": "Portugal - Accounting",
    "version": "16.0.0.1.0",
    "author": "ThinkOpen Solutions, Exo Software",
    "website": "https://exosoftware.pt",
    "category": "Accounting/Localizations/Account Charts",
    "depends": [
        "base",
        "account",
        "base_vat",
    ],
    "data": [
        "data/l10n_pt_chart_data.xml",
        "data/account_chart_template_data.xml",
        "data/account_fiscal_position_template_data.xml",
        "data/account_tax_group_data.xml",
        "data/account_tax_report.xml",
        "data/account_tax_data.xml",
        # 'data/account_chart_template_configure_data.xml',
    ],
    "demo": [
        "demo/demo_company.xml",
    ],
    "license": "LGPL-3",
}
