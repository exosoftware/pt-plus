from openupgradelib import openupgrade

_module_rename = [
    ("ptplus_pos_restaurant", "ptplus_pos"),
]


@openupgrade.migrate()
def migrate(env, version):
    # the Odoo upgrade platform leaves unknown modules in "to upgrade"
    if env["ir.module.module"].search(
        [
            ("name", "=", "ptplus_pos_restaurant"),
            ("state", "in", ["installed", "to remove", "to upgrade"]),
        ]
    ):
        openupgrade.update_module_names(env.cr, _module_rename, merge_modules=True)
