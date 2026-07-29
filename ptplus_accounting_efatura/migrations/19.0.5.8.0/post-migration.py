import logging

from openupgradelib import openupgrade

from odoo import Command

_logger = logging.getLogger(__name__)  # pylint: disable=C0103

# The four dropped default tax fields and the rate each of them stood for. One
# mapping row per field that was actually filled in: the point is to carry the
# configured taxes over, so a company ends up with about as many mappings as a
# fresh install gets by default.
OLD_DEFAULTS = [
    ("tax_id", "23"),
    ("interm_tax_id", "13"),
    ("reduced_tax_id", "6"),
    ("exempt_tax_id", "0"),
]
COMPANY_COLUMNS = [f"l10n_pt_efatura_{suffix}" for suffix, _r in OLD_DEFAULTS] + [
    "l10n_pt_efatura_product_id"
]
PARTNER_COLUMNS = [
    f"property_l10n_pt_efatura_{suffix}" for suffix, _r in OLD_DEFAULTS
] + ["property_l10n_pt_efatura_product_id"]


def _company_defaults(env):
    """{company_id: ({rate: tax_id}, product_id)} from the old res_company
    columns."""
    if not all(
        openupgrade.column_exists(env.cr, "res_company", c) for c in COMPANY_COLUMNS
    ):
        return {}
    env.cr.execute(f"SELECT id, {', '.join(COMPANY_COLUMNS)} FROM res_company")
    defaults = {}
    for company_id, *values in env.cr.fetchall():
        taxes = {
            rate: tax_id
            for (_s, rate), tax_id in zip(OLD_DEFAULTS, values[:-1])
            if tax_id
        }
        if taxes:
            defaults[company_id] = (taxes, values[-1])
    return defaults


def _partner_defaults(env):
    """{(company_id, partner_id): ({rate: tax_id}, product_id)} from the old
    company dependent res_partner properties (jsonb keyed by company id)."""
    if not all(
        openupgrade.column_exists(env.cr, "res_partner", c) for c in PARTNER_COLUMNS
    ):
        return {}
    env.cr.execute(
        f"""
        SELECT id, {", ".join(PARTNER_COLUMNS)}
        FROM res_partner
        WHERE {" OR ".join(f"{c} IS NOT NULL" for c in PARTNER_COLUMNS)}
        """
    )
    defaults = {}
    for partner_id, *properties in env.cr.fetchall():
        for (_s, rate), taxes in zip(OLD_DEFAULTS, properties[:-1]):
            for company_key, tax_id in (taxes or {}).items():
                if tax_id:
                    key = (int(company_key), partner_id)
                    defaults.setdefault(key, ({}, None))[0][rate] = tax_id
        for company_key, product_id in (properties[-1] or {}).items():
            if product_id:
                key = (int(company_key), partner_id)
                defaults[key] = (defaults.get(key, ({}, None))[0], product_id)
    return defaults


def _mapping_vals(company_id, partner_id, product_id, rate, tax_id, country_id):
    """One mapping row, shaped like the ones a fresh install gets by default.

    Mind that a migration script runs against the *latest* model, not the one of
    its own version: a database coming from before 5.8.0 runs this script with
    the fields as they stand today, hence partner_ids and the rate as text.
    """
    return {
        # Mappings for a vendor are only reached while they sit above the
        # generic ones, so they start at the top of the table
        "sequence": 5 if partner_id else 10,
        "company_id": company_id,
        "partner_ids": [Command.set([partner_id])] if partner_id else False,
        "product_id": product_id,
        "tax_percentage": rate,
        "tax_genre": "IVA" if rate != "0" else False,
        "country_id": country_id,
        "region": "PT",
        "tax_id": tax_id,
    }


@openupgrade.migrate()
def migrate(env, version):
    company_defaults = _company_defaults(env)
    partner_defaults = _partner_defaults(env)
    if not company_defaults and not partner_defaults:
        return

    company_ids = set(env["res.company"].with_context(active_test=False).search([]).ids)
    tax_ids = set(env["account.tax"].with_context(active_test=False).search([]).ids)
    product_ids = set(
        env["product.product"].with_context(active_test=False).search([]).ids
    )
    country_pt = env.ref("base.pt", raise_if_not_found=False)
    country_id = country_pt.id if country_pt else False

    def usable_product(product_id, company_product):
        """The old product field is optional on a mapping, so an unset or deleted
        one simply carries over as empty."""
        for candidate in (product_id, company_product):
            if candidate in product_ids:
                return candidate
        return None

    vals_list = []
    for company_id, (company_taxes, company_product) in company_defaults.items():
        if company_id not in company_ids:
            continue
        product_id = usable_product(company_product, None)
        for rate, tax_id in company_taxes.items():
            if tax_id in tax_ids:
                vals_list.append(
                    _mapping_vals(
                        company_id, None, product_id, rate, tax_id, country_id
                    )
                )

    for (company_id, partner_id), (
        partner_taxes,
        partner_product,
    ) in partner_defaults.items():
        if company_id not in company_ids:
            continue
        company_taxes, company_product = company_defaults.get(company_id, ({}, None))
        product_id = usable_product(partner_product, company_product)
        for rate, tax_id in partner_taxes.items():
            if tax_id not in tax_ids:
                continue
            # The old get_create_supplier() copied the company defaults onto
            # every vendor it created, so most vendors carry a configuration
            # identical to the company's. A mapping for those would only repeat
            # what the generic one already says: skip it and keep the table
            # readable.
            if tax_id == company_taxes.get(rate) and product_id == usable_product(
                company_product, None
            ):
                continue
            vals_list.append(
                _mapping_vals(
                    company_id, partner_id, product_id, rate, tax_id, country_id
                )
            )

    if vals_list:
        env["l10n_pt.account.efatura.tax.mapping"].create(vals_list)
        _logger.info("Created %s E-Fatura tax mappings", len(vals_list))

    openupgrade.drop_columns(
        env.cr,
        [("res_company", column) for column in COMPANY_COLUMNS]
        + [("res_partner", column) for column in PARTNER_COLUMNS],
    )
