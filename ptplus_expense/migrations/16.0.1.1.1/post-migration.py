from openupgradelib import openupgrade


@openupgrade.migrate()
def migrate(env, version):
    location_product_templates = [
        env.ref(
            "ptplus_expense.trav_expenses_own_vehicle", raise_if_not_found=False
        ).id,
        env.ref("ptplus_expense.per_diems_national", raise_if_not_found=False).id,
        env.ref("ptplus_expense.per_diems_national_75", raise_if_not_found=False).id,
        env.ref("ptplus_expense.per_diems_national_50", raise_if_not_found=False).id,
        env.ref("ptplus_expense.per_diems_national_25", raise_if_not_found=False).id,
        env.ref("ptplus_expense.per_diems_internacional", raise_if_not_found=False).id,
        env.ref(
            "ptplus_expense.per_diems_internacional_75", raise_if_not_found=False
        ).id,
        env.ref(
            "ptplus_expense.per_diems_internacional_50", raise_if_not_found=False
        ).id,
        env.ref(
            "ptplus_expense.per_diems_internacional_25", raise_if_not_found=False
        ).id,
    ]
    products = env["product.template"].search(
        [
            ("can_be_expensed", "=", True),
            ("l10n_pt_expense_type", "=", True),
            ("id", "not in", location_product_templates),
        ]
    )
    products.write(
        {
            "l10n_pt_expense_type": False,
        }
    )
