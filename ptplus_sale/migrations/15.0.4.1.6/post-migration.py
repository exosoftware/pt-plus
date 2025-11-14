from openupgradelib import openupgrade


@openupgrade.migrate()
def migrate(env, version):
    # Search for problematic orders
    orders = env["sale.order"].search([
        ('system_entry_date', '!=', False),
        ('fiscal_document_status', '=', False),
        ('atcud', '=', False),
        ('state', '=', "sent"),
    ])

    # and restore fiscal_document_status and atcud on them
    for order in orders:
        atcud = "{validation_code}-{serial_number}".format(
            validation_code=order.fiscal_document_type_id.validation_code,
            serial_number=order.pt_get_no().split("/", 1)[1],
        )

        order.write({
            'atcud': atcud,
            'fiscal_document_status': 'N',
        })


