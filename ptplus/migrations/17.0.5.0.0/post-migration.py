import logging

from odoo import SUPERUSER_ID, api

_logger = logging.getLogger(__name__)  # pylint: disable=C0103


def migrate(cr, version):
    try:
        env = api.Environment(cr, SUPERUSER_ID, {})
        env["publisher_warranty.contract"].update_notification()
    except Exception:
        _logger.info("Publisher warranty notification failed")
