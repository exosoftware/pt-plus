from openupgradelib import openupgrade

from odoo.tools import SQL

OLD_MODULE = "ptplus_accounting_tax_statement"
NEW_MODULE = "ptplus_accounting_reports"


@openupgrade.migrate()
def migrate(env, version):
    # ptplus_accounting_tax_statement is gone in 20.0 and its statements live
    # in ptplus_accounting_reports. The merge runs here, in the module the old
    # one depends on, so it also runs where ptplus_accounting_reports is not
    # installed yet. At the end of the update Odoo removes the old models and
    # data; the records another module also declares only lose the old XML id.
    # The Odoo upgrade platform leaves unknown modules in "to upgrade".
    Module = env["ir.module.module"]
    old_module = Module.search(
        [
            ("name", "=", OLD_MODULE),
            ("state", "in", ["installed", "to remove", "to upgrade"]),
        ]
    )
    if not old_module:
        return
    Module.search(
        [("name", "=", NEW_MODULE), ("state", "=", "uninstalled")]
    ).button_install()
    # Odoo only drops the table of a model it removes while the model is in the
    # registry, and the merge deletes the many2many relations of the old module:
    # drop the tables no other module declares.
    env.cr.execute(
        """
        SELECT replace(m.model, '.', '_')
        FROM ir_model m
        JOIN ir_model_data d ON d.model = 'ir.model' AND d.res_id = m.id
        WHERE d.module = %(name)s
            AND NOT EXISTS (
                SELECT 1 FROM ir_model_data o
                WHERE o.model = 'ir.model' AND o.res_id = m.id
                    AND o.module != %(name)s
            )
        UNION
        SELECT name FROM ir_model_relation
        WHERE module = %(id)s
            AND name NOT IN (
                SELECT name FROM ir_model_relation WHERE module != %(id)s
            )
        """,
        {"name": OLD_MODULE, "id": old_module.id},
    )
    for (table,) in env.cr.fetchall():
        env.cr.execute(SQL("DROP TABLE IF EXISTS %s CASCADE", SQL.identifier(table)))
    openupgrade.update_module_names(
        env.cr, [(OLD_MODULE, NEW_MODULE)], merge_modules=True
    )
