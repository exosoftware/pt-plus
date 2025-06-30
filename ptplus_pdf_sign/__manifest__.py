{
    "name": "Portugal - Digital Signatures on PDF Reports",
    "summary": "Sign your PDF reports using qualified digital certificates "
    "and cryptography.",
    "version": "14.0.1.2.0",
    "category": "Tools",
    "license": "OPL-1",
    "author": "Exo Software",
    "website": "https://exosoftware.pt",
    "depends": [
        "base",
        "account",
        "ptplus",
    ],
    "external_dependencies": {
        "python": ["pyotp", "pyhanko", "asn1crypto", "cryptography"],
    },
    "data": [
        "security/ir.model.access.csv",
        "data/l10n_pt_report_signature_data.xml",
        "views/l10n_pt_report_signature.xml",
        "views/res_config_settings_view.xml",
        "views/report_templates.xml",
        "views/assets.xml",
    ],
    "application": False,
    "installable": True,
    "auto_install": False,
}
