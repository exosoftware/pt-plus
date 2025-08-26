# Copyright 2018 Exo Software, Lda. (<https://exosoftware.pt>)
# Copyright 2013 Agile Business Group sagl (<http://www.agilebg.com>)
# Copyright 2016 Serpent Consulting Services Pvt. Ltd.
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

{
    "name": "Portugal - Sale order version",
    "version": "17.0.4.0.0",
    "category": "Sale Management",
    "author": "Exo Software,"
    "Agile Business Group,"
    "Camptocamp,"
    "Akretion,"
    "Odoo Community Association (OCA), "
    "Serpent Consulting Services Pvt. Ltd.",
    "website": "https://exosoftware.pt",
    "license": "AGPL-3",
    "depends": [
        "sale",
        "ptplus_sale",
    ],
    "data": [
        "data/sale_order_sequence_data.xml",
        "views/sale_order_views.xml",
        "views/report_sale_order.xml",
    ],
    "installable": False,
    "post_init_hook": "populate_unversioned_name",
}
