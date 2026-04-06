import logging

from odoo import SUPERUSER_ID, api

_logger = logging.getLogger(__name__)  # pylint: disable=C0103


def migrate(cr, version):
    env = api.Environment(cr, SUPERUSER_ID, {})

    # Make PT+ tax tags updatable so that they can be refreshed
    tax_tag_data = env["ir.model.data"].search(
        [
            ("module", "=", "ptplus"),
            ("model", "=", "account.account.tag"),
            ("name", "ilike", "tax_tag_%"),
        ]
    )

    tax_tag_data.write({"noupdate": False})
    _logger.info("PT+ tax tags were marked as updatable")
