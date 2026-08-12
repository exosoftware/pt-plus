=================================
Portugal - Fatura Sem Papel (FSP)
=================================

Integrates Odoo with the Portuguese government's **Fatura Sem Papel** (FSP)
service, operated by ARTE. When a customer invoice is confirmed, Odoo
automatically delivers the PDF to the FSP
portal, which forwards it to the customer's registered email address. Customers
who have not subscribed to FSP are silently skipped.

**Table of contents**

.. contents::
   :local:

Installation
============

Add the module to an addons folder, restart Odoo, update the addons list and
activate it. Exo's pre-production and production certificates (and the ARTE
software identifiers) are seeded into the system parameters automatically on
installation; the production certificate is seeded only once it is available in
``certificates/production/``. The production private key is the same as the
pre-production one (it is reused from ``certificates/pre-production/``).

The active environment — pre-production (ARTE test portal) or production — is
selected from the company's **Certification Service Backend**
(``l10n_pt_cert_service_backend``): the *Test* backend uses pre-production, any
real backend (e.g. *Exo Software*) uses production.

Configuration
=============

Open *Settings → Accounting → Fatura Sem Papel* (visible to the **FSP Manager**
group only) and:

* Fill in the **Instance Id** and **Software Provider NIPC** registered with
  ARTE for the software provider. These identify the SW in the authentication
  token and must match exactly what ARTE registered (Exo's own values, or the
  client's own when it has a dedicated ARTE protocol).
* Make sure the company has a valid 9-digit NIPC and fill in the **Seller Name**
  and **Seller Email**. The company VAT is sent automatically as the merchant
  identifier; it is shown read-only as the **Seller NIPC**.
* Click **Authenticate SW** and then **Register Seller** to register the company
  as an invoice issuer on the FSP platform.

Clients with their own ARTE protocol can upload their own certificate and private
key for either environment in the same screen and validate each with the
**Validate Pre-production** / **Validate Production** buttons. Uploaded files are
stored encrypted in the system parameters and never sent back to the browser.

Once registered, FSP is enabled on all of the company's sales journals. You can
toggle it per journal under *Accounting → Configuration → Journals*, in the
*Electronic Data Interchange* section.

Usage
=====

Just confirm your customer invoices as usual. Odoo checks whether the customer
is subscribed to FSP and, if so, queues the PDF for delivery through the EDI
cron. The delivery status is shown in the *Electronic Data Interchange* section
of the invoice form, where an invoice in error can also be resent manually.

Known issues / Roadmap
======================

* The AES key used to encrypt the certificate at rest is a module-level
  constant; it should be derived from an instance secret.

Changelog
=========

19.0.0.0.1
~~~~~~~~~~

**Features**

- Initial release: FSP integration via ARTE REST API, with certificate-based JWT
  authentication, automatic token renewal, AES-256 encrypted PDF delivery and
  EDI hooks for automatic invoice submission.

Credits
=======

Authors
~~~~~~~

* Exo Software, Lda.

Contributors
~~~~~~~~~~~~

* `Exo Software <https://exosoftware.pt>`_:

  * Pedro Pereira
  * Pedro Castro Silva

Maintainer
~~~~~~~~~~

This module is maintained by Exo Software, Lda.

.. image:: https://exosoftware.pt/logo.png
   :alt: Exo Software
   :target: https://exosoftware.pt
   :width: 100px
