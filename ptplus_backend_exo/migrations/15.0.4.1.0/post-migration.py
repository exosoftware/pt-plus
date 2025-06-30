from openupgradelib import openupgrade


@openupgrade.migrate()
def migrate(env, version):
    old_cert_service_backend = env["ir.config_parameter"].sudo().get_param(
        "certification.service.backend", ""
    )

    if old_cert_service_backend:
        company_ids = env["res.company"].search([]).filtered(
            lambda c: c.country_code == "PT")

        company_ids.write({
            "l10n_pt_cert_service_backend": old_cert_service_backend
        })

        # Remove certificate from system parameters
        env["ir.config_parameter"].sudo().set_param(
            "certification.service.backend", False
        )
