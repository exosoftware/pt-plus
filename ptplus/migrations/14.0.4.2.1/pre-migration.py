from openupgradelib import openupgrade

xmlids_spec = [
    (
        "ptplus.tax_tag_iva_dp_1",
        "ptplus.tax_tag_iva_dp_1_v"
    ),
    (
        "ptplus.tax_tag_iva_dp_3",
        "ptplus.tax_tag_iva_dp_3_v"
    ),
    (
        "ptplus.tax_tag_iva_dp_5",
        "ptplus.tax_tag_iva_dp_5_v"
    ),
]


@openupgrade.migrate()
def migrate(env, version):
    try:
        if env.ref("ptplus.tax_tag_iva_dp_3"):
            openupgrade.rename_xmlids(env.cr, xmlids_spec)
    except:
        pass


