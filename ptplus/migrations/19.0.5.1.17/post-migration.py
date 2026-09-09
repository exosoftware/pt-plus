import logging

from openupgradelib import openupgrade

_logger = logging.getLogger(__name__)  # pylint: disable=C0103


@openupgrade.migrate()
def migrate(env, version):
    continente_xmlid = "fp_national"
    azores_xmlid = "fp_azores"
    old_continente_sequence = 30
    old_azores_sequence = 10
    new_continente_sequence = 10
    new_azores_sequence = 30
    excluded_state_xmlids = ("base.state_pt_pt-20", "base.state_pt_pt-30")

    excluded_states = [
        env.ref(xmlid, raise_if_not_found=False) for xmlid in excluded_state_xmlids
    ]
    excluded_state_ids = [state.id for state in excluded_states if state]

    companies = (
        env["res.company"]
        .with_context(active_test=False)
        .search([("partner_id.state_id", "not in", excluded_state_ids)])
    )
    for company in companies:
        continente = env.ref(
            f"account.{company.id}_{continente_xmlid}", raise_if_not_found=False
        )
        azores = env.ref(
            f"account.{company.id}_{azores_xmlid}", raise_if_not_found=False
        )
        if not continente or not azores:
            continue
        if (
            continente.sequence != old_continente_sequence
            or azores.sequence != old_azores_sequence
        ):
            continue

        continente.sequence = new_continente_sequence
        azores.sequence = new_azores_sequence
        _logger.info(
            "Company %s (%s): moved Continente fiscal position to sequence %s",
            company.id,
            company.name,
            new_continente_sequence,
        )
