import logging

from odoo import api

_logger = logging.getLogger(__name__)  # pylint: disable=C0103


def migrate(cr, version):
    # The PoS now only offers PoS document types. Mark the ones the PoS already
    # uses, unless the backoffice also issued documents with them.
    cr.execute(
        """
        WITH pos_types AS (
            SELECT l10n_pt_inv_fiscal_doc_type_id AS id FROM pos_config
            UNION
            SELECT l10n_pt_cred_fiscal_doc_type_id FROM pos_config
            UNION
            SELECT l10n_pt_bill_fiscal_doc_type_id FROM pos_config
        ),
        shared_types AS (
            SELECT am.fiscal_document_type_id AS id
            FROM account_move am
            WHERE am.fiscal_document_type_id IN (SELECT id FROM pos_types)
                AND NOT EXISTS (
                    SELECT 1 FROM pos_order po WHERE po.account_move = am.id
                )
            UNION
            SELECT so.fiscal_document_type_id
            FROM sale_order so
            WHERE so.fiscal_document_type_id IN (SELECT id FROM pos_types)
        )
        UPDATE fiscal_document_type fdt
        SET point_of_sale = TRUE
        WHERE fdt.id IN (SELECT id FROM pos_types)
            AND fdt.id NOT IN (SELECT id FROM shared_types)
            AND fdt.type IN ('FR', 'NC', 'CM')
        """
    )
    cr.execute(
        """
        SELECT fdt.id
        FROM fiscal_document_type fdt
        JOIN pos_config pc
            ON fdt.id IN (
                pc.l10n_pt_inv_fiscal_doc_type_id,
                pc.l10n_pt_cred_fiscal_doc_type_id,
                pc.l10n_pt_bill_fiscal_doc_type_id
            )
        WHERE fdt.point_of_sale IS NOT TRUE
        """
    )
    left_out = sorted({row[0] for row in cr.fetchall()})
    if left_out:
        _logger.warning(
            "Fiscal document types %s are set on a PoS but were not marked as "
            "PoS document types: the backoffice uses them too, or their type "
            "is not FR, NC or CM.",
            left_out,
        )

    # The bill series of a shop (a PoS OR) didn't exist before 20.0. Created
    # after the marking above, so that a CM already in use is not duplicated.
    env = api.Environment(cr, api.SUPERUSER_ID, {})
    pt_charts = env["account.chart.template"]._get_pt_charts()
    for company in env["res.company"].search([]):
        if company.chart_template in pt_charts:
            company.l10n_pt_create_default_fiscal_doc_types(["invoice"])
