##############################################################################
#
#    Copyright (C) 2016 Exo Software, Lda. (<https://exosoftware.pt>)
#
##############################################################################

from openupgradelib import openupgrade


@openupgrade.migrate()
def migrate(env, version):

    # Make all necessary module renames
    openupgrade.update_module_names(
        env.cr,
        [
            ("l10n_pt", "ptplus"),
            ("l10n_pt_account_credit_note", "ptplus_account_credit_note"),
            ("l10n_pt_account_debit_note", "ptplus_account_debit_note"),
            ("l10n_pt_account_reports", "ptplus_account_reports"),
            ("l10n_pt_accounting", "ptplus_accounting"),
            ("l10n_pt_accounting_asset", "ptplus_accounting_asset"),
            ("l10n_pt_accounting_asset_management", "ptplus_accounting_asset_management"),
            ("l10n_pt_accounting_cashflow", "ptplus_accounting_cashflow"),
            ("l10n_pt_accounting_cashflow_mis_report",
             "ptplus_accounting_cashflow_mis_report"),
            ("l10n_pt_accounting_efatura", "ptplus_accounting_efatura"),
            ("l10n_pt_accounting_mis_reports", "ptplus_accounting_mis_reports"),
            ("l10n_pt_accounting_tax_statement", "ptplus_accounting_tax_statement"),
            ("l10n_pt_backend_exo", "ptplus_backend_exo"),
            ("l10n_pt_invoice_grouped_by_picking", "ptplus_invoice_grouped_by_picking"),
            ("l10n_pt_partner", "ptplus_partner"),
            ("l10n_pt_pos", "ptplus_pos"),
            ("l10n_pt_saft", "ptplus_saft"),
            ("l10n_pt_sale", "ptplus_sale"),
            ("l10n_pt_sale_version", "ptplus_sale_version"),
            ("l10n_pt_self_billing", "ptplus_self_billing"),
            ("l10n_pt_stock", "ptplus_stock"),
            ("l10n_pt_stock_invoice_report", "ptplus_stock_invoice_report"),
        ],
        merge_modules=True,
    )

    # At this stage, the l10n_pt record in ir_module_module has been renamed to ptplus.
    # But we need it so let's copy it from the ptplus one.
    module_ptplus = env["ir.module.module"].search(
        [('name', '=', 'ptplus')],
        limit=1,
    )
    module_l10n_pt = module_ptplus.copy(
        {
            'name': 'l10n_pt',
            'state': 'to install',
        })

    # env.cache.invalidate()
    module_l10n_pt.button_immediate_install()
