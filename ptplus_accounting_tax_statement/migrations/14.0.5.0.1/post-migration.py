from openupgradelib import openupgrade


@openupgrade.migrate()
def migrate(env, version):
    company_ids = env["res.company"].search([])

    tag_maps = [
        (env.ref("ptplus.tax_tag_iva_dp_1_v").id, env.ref("ptplus.tax_tag_iva_dp_1_c").id),
        (env.ref("ptplus.tax_tag_iva_dp_3_v").id, env.ref("ptplus.tax_tag_iva_dp_3_c").id),
        (env.ref("ptplus.tax_tag_iva_dp_5_v").id, env.ref("ptplus.tax_tag_iva_dp_5_c").id),
    ]
    for company_id in company_ids:
        for src_tag, dest_tag in tag_maps:

            # STEP 1: find purchase taxes containing the src tag on repartition lines
            repartition_line_ids = env["account.tax.repartition.line"].with_context(
                active_test=False).search([
                ("company_id", "=", company_id.id),
                ("tag_ids", "in", [src_tag]),
                ("repartition_type", "=", "base"),
            ])
            repartition_line_ids = repartition_line_ids.filtered(
                lambda r: (r.invoice_tax_id and r.invoice_tax_id.type_tax_use == "purchase") or
                          r.refund_tax_id and r.refund_tax_id.type_tax_use == "purchase"
            )

            taxes = env["account.tax"]
            if repartition_line_ids:
                taxes = repartition_line_ids.mapped("invoice_tax_id") + \
                        repartition_line_ids.mapped("refund_tax_id")
                # taxes = taxes.filtered(lambda r: r.type_tax_use == "purchase")

            # STEP 2: replace source tag with destination tag on move lines
            # containing both the tax and the source tag
            move_lines = env["account.move.line"].search(
                [
                    ("tax_ids", "in", taxes.ids),
                    ("tax_tag_ids", "in", [src_tag]),
                ]
            )
            for move_line in move_lines:
                move_line.tax_tag_ids = [(3, src_tag, 0)]
                move_line.tax_tag_ids = [(4, dest_tag, 0)]

            # STEP 3: replace source tag with destination tag on repartition lines
            for repartition_line_id in repartition_line_ids:
                repartition_line_id.tag_ids = [(3, src_tag, 0)]
                repartition_line_id.tag_ids = [(4, dest_tag, 0)]

