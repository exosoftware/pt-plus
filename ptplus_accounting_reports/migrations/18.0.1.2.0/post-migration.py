import logging

_logger = logging.getLogger(__name__)  # pylint: disable=C0103

# Menus that were released from the experimental features group: the Trial
# Balance now, and the Balance Sheet / Profit & Loss earlier on. Dropping the
# "groups" attribute from a menuitem does not clear the M2M on databases where
# it was already loaded (convert.py only writes group_ids when the attribute is
# present), so the menus would stay hidden to anyone outside the group.
# The Monthly Stamp Duty menu still declares the group and is left untouched.
RELEASED_MENUS = [
    "l10n_pt_trial_balance_wizard_menu",
    "l10n_pt_balance_sheet_wizard_menu",
    "l10n_pt_profit_loss_wizard_menu",
]


def migrate(cr, version):
    cr.execute(
        """
        DELETE FROM ir_ui_menu_group_rel
        WHERE menu_id IN (
                  SELECT res_id FROM ir_model_data
                  WHERE module = 'ptplus_accounting_reports'
                    AND name IN %s
              )
          AND gid IN (
                  SELECT res_id FROM ir_model_data
                  WHERE module = 'ptplus'
                    AND name = 'group_experimental_features_pt'
              )
        """,
        (tuple(RELEASED_MENUS),),
    )
    _logger.info(
        "%s menu(s) released from the experimental features group", cr.rowcount
    )
