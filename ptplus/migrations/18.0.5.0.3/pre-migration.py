from odoo import SUPERUSER_ID, api


def migrate(cr, version):
    env = api.Environment(cr, SUPERUSER_ID, {})
    tax_tags = []
    for ref in [
        "ptplus.tax_tag_rf_m30_09",
        "ptplus.tax_tag_rf_m30_10",
        "ptplus.tax_tag_rf_m30_16",
    ]:
        tag = env.ref(ref, raise_if_not_found=False)
        if tag:
            tax_tags.append(tag.id)

    for tag in tax_tags:
        env["account.move.line"].search(
            [
                ("tax_tag_ids", "in", [tag]),
            ]
        ).tax_tag_ids = [(3, tag, 0)]

        env["account.tax.repartition.line"].search(
            [
                ("tag_ids", "in", [tag]),
            ]
        ).tag_ids = [(3, tag, 0)]
