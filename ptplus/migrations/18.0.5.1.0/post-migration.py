import logging

from openupgradelib import openupgrade

_logger = logging.getLogger(__name__)  # pylint: disable=C0103


def format_in(search_list):
    if not search_list:
        return "(-999999)"
    return str(tuple(search_list)).replace(",)", ")")


def select_tags(env, name_filter):
    return env["account.account.tag"].search(
        [
            ("applicability", "=", "taxes"),
            ("name", "like", name_filter),
        ]
    )


def delete_tags(env, scope, tags):
    _logger.info(
        "Deleting tags %s on scope %s", ",".join(tag.name for tag in tags), scope
    )
    if not tags:
        return

    if scope == "all" and tags:
        openupgrade.logged_query(
            env.cr,
            """
                DELETE FROM account_account_tag_account_move_line_rel
                WHERE account_account_tag_id IN {tag_ids};
            """.format(
                tag_ids=format_in(tags.ids)
            ),
        )

        openupgrade.logged_query(
            env.cr,
            """
                DELETE FROM account_account_tag_account_tax_repartition_line_rel
                WHERE account_account_tag_id IN {tag_ids};
            """.format(
                tag_ids=format_in(tags.ids)
            ),
        )
    else:
        # Get scope filtered account move lines
        domain = [("tax_tag_ids", "in", tags.ids)]
        if scope == "base":  # tax base (base tributável)
            domain.extend([("tax_line_id", "=", False)])
        else:
            domain.extend([("tax_line_id", "!=", False)])
        aml = env["account.move.line"].search(domain)

        # Delete their tags
        if tags and aml:
            openupgrade.logged_query(
                env.cr,
                """
                    DELETE FROM account_account_tag_account_move_line_rel
                    WHERE account_account_tag_id IN {tag_ids} AND
                          account_move_line_id IN {aml_ids};
                """.format(
                    tag_ids=format_in(tags.ids),
                    aml_ids=format_in(aml.ids),
                ),
            )

        # Get scope filtered tax repartition lines
        domain = [("tag_ids", "in", tags.ids), ("repartition_type", "=", scope)]
        trl = env["account.tax.repartition.line"].search(domain)

        # Delete their tags
        if tags and trl:
            openupgrade.logged_query(
                env.cr,
                """
                    DELETE FROM account_account_tag_account_tax_repartition_line_rel
                    WHERE account_account_tag_id IN {tag_ids} AND
                          account_tax_repartition_line_id IN {trl_ids};
                """.format(
                    tag_ids=format_in(tags.ids),
                    trl_ids=format_in(trl.ids),
                ),
            )


def replace_tags(env, scope, old_tags, new_tag):
    _logger.info(
        "Replacing tags %s on scope %s with %s",
        ",".join(tag.name for tag in old_tags),
        scope,
        new_tag.name,
    )
    if not old_tags:
        return

    if scope == "all" and old_tags and new_tag:
        openupgrade.logged_query(
            env.cr,
            """
                UPDATE  account_account_tag_account_move_line_rel
                SET     account_account_tag_id = {new_tag}
                WHERE   account_account_tag_id IN {tag_ids};
            """.format(
                new_tag=new_tag.id, tag_ids=format_in(old_tags.ids)
            ),
        )

        openupgrade.logged_query(
            env.cr,
            """
                UPDATE  account_account_tag_account_tax_repartition_line_rel
                SET     account_account_tag_id = {new_tag}
                WHERE   account_account_tag_id IN {tag_ids};
            """.format(
                new_tag=new_tag.id,
                tag_ids=format_in(old_tags.ids),
            ),
        )
        return

    # Get scope filtered account move lines
    domain = [("tax_tag_ids", "in", old_tags.ids)]
    if scope == "base":  # tax base (base tributável)
        domain.extend([("tax_line_id", "=", False)])
    else:
        domain.extend([("tax_line_id", "!=", False)])
    aml = env["account.move.line"].search(domain)

    # Replace their tags
    if old_tags and aml and new_tag:
        openupgrade.logged_query(
            env.cr,
            """
                UPDATE  account_account_tag_account_move_line_rel
                SET     account_account_tag_id = {new_tag}
                WHERE   account_account_tag_id IN {tag_ids} AND
                        account_move_line_id IN {aml_ids};
            """.format(
                new_tag=new_tag.id,
                tag_ids=format_in(old_tags.ids),
                aml_ids=format_in(aml.ids),
            ),
        )

    # Get scope filtered tax repartition lines
    domain = [("tag_ids", "in", old_tags.ids), ("repartition_type", "=", scope)]
    trl = env["account.tax.repartition.line"].search(domain)

    # Delete their tags
    if old_tags and trl and new_tag:
        openupgrade.logged_query(
            env.cr,
            """
                UPDATE  account_account_tag_account_tax_repartition_line_rel
                SET     account_account_tag_id = {new_tag}
                WHERE   account_account_tag_id IN {tag_ids} AND
                        account_tax_repartition_line_id IN {trl_ids};
            """.format(
                new_tag=new_tag.id,
                tag_ids=format_in(old_tags.ids),
                trl_ids=format_in(trl.ids),
            ),
        )


@openupgrade.migrate()
def migrate(env, version):

    # Replace the temporary tags with the real ones
    replace_tags(
        env, "all", select_tags(env, "TMP DM"), env.ref("ptplus.tax_tag_rf_dm")
    )
    replace_tags(
        env, "all", select_tags(env, "TMP M10B"), env.ref("ptplus.tax_tag_rf_m10_05_03")
    )
    replace_tags(
        env, "all", select_tags(env, "TMP M10T"), env.ref("ptplus.tax_tag_rf_m10_05_06")
    )
    replace_tags(
        env, "all", select_tags(env, "TMP M30B"), env.ref("ptplus.tax_tag_rf_m30_08_35")
    )
    replace_tags(
        env, "all", select_tags(env, "TMP M30T"), env.ref("ptplus.tax_tag_rf_m30_08_37")
    )

    # Delete the temporary tags
    env["account.account.tag"].search(
        [
            ("name", "in", ["TMP DM", "TMP M10B", "TMP M10T", "TMP M30B", "TMP M30T"]),
        ]
    ).unlink()
