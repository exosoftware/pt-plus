# Production FSP certificate

Drop the **production** certificate and private key delivered by ARTE here:

- `certificate.p7b` — production PKCS#7 certificate for the Exo Software SW instance
- `private.key` — matching RSA private key, PEM format (unencrypted)

These files are **not** committed yet because ARTE has not delivered the production
certificate. The file names must match exactly.

## Activating production

1. Place `certificate.p7b` and `private.key` in this folder.
2. Set `_FSP_PRODUCTION = True` in `models/res_company.py`.
3. (Re)install the module so `post_init_hook` seeds the certificate into the
   `ptplus_fsp.certificate` / `ptplus_fsp.private_key` system parameters. If those
   parameters already hold a (pre-production) certificate, clear them first — the hook
   never overwrites an existing value.

The same parameters and code paths are used in both environments; the only difference is
which folder is read and which API base URL is called.
