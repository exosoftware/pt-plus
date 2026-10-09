from openupgradelib import openupgrade

# Views of the SAF-T import that moved to ptplus_saft_import. They reference
# fields this version no longer defines, and the dependent modules' views are
# validated against them before the orphan cleanup would remove them.
STALE_VIEWS = [
    "ptplus_saft.move_saft_imports",
    "ptplus_saft.partner_saft_imports",
    "ptplus_saft.product_saft_imports",
    "ptplus_saft.account_saft_imports",
    "ptplus_saft.journal_saft_imports",
    "ptplus_saft.l10n_pt_import_saft_configuration_form",
    "ptplus_saft.import_saft_configuration_kanban_view",
    "ptplus_saft.import_saft_configuration_list_view",
    "ptplus_saft.account_saft_import_tree",
    "ptplus_saft.account_saft_import_search",
    "ptplus_saft.menu_account_saft_import_list",
    "ptplus_saft.action_import_saft_configuration_view",
    "ptplus_saft.ir_cron_process_saft_import",
]


@openupgrade.migrate()
def migrate(env, version):
    openupgrade.delete_records_safely_by_xml_id(env, STALE_VIEWS)
