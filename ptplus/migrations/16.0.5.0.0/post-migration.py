import logging

from openupgradelib import openupgrade

_logger = logging.getLogger(__name__)  # pylint: disable=C0103


@openupgrade.migrate()
def migrate(env, version):
    try:
        env["publisher_warranty.contract"].update_notification()
    except Exception:
        _logger.info("Publisher warranty notification failed")
