# AT certificates

`prod/` holds Exo Software's production certificates: the AT certificate chain and the
AT public key. The TLS client certificate and the private key that signs fiscal
documents are in `../../backends.py`.

These are used as long as nothing is uploaded under Accounting Settings, in the Portugal
section; see `ptplus/certificates.py` for the format of the file a client uploads.
