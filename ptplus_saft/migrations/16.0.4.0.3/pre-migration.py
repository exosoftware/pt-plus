import logging

from openupgradelib import openupgrade

_logger = logging.getLogger(__name__)  # pylint: disable=C0103


@openupgrade.migrate()
def migrate(env, version):
    models_to_delete = [
        "dataport.import.saft.product",
        "dataport.import.saft.account.group",
        "dataport.import.saft.account",
        "dataport.import.saft.partner",
    ]

    # Loop through the list of models to delete
    for model in models_to_delete:
        # Delete the model from ir_model if it exists
        env.cr.execute(f"DELETE FROM ir_model WHERE model = '{model}'")

        # Delete the model data from ir_model_data if it exists
        env.cr.execute(f"DELETE FROM ir_model_data WHERE model = '{model}'")

        # Optional: Log the deletion for debugging purposes
        _logger.info(f"Deleted model and data for: {model}")
