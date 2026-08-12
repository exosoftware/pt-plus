===================
Portugal - E-Fatura
===================

Synchronize supplier invoices the Tax Authority website or from an
E-Fatura .csv file:

* For every line in the e-fatura file, a new draft vendor bill or refund will
  be created if there isn't one already inserted with the same vendor and
  vendor reference.
* The vendor itself will also be created if necessary.
* If an e-fatura document already exists in the database, a warning will be
  displayed if its values don't match the e-fatura values.
* The relevant invoice data is saved in a custom table containing all the
  imported e-fatura lines so that the user can check at any time if the
  vendor invoices match their e-fatura data.

**Table of contents**

.. contents::
   :local:

Installation
============

Install the module with required dependencies:

* pip install bs4, requests_html
* add the module to an addons folder, restart Odoo, update the addons list and activate
  it.

Configuration
=============

This module adds a new section named 'E-Fatura (Import)' on the Invoicing tab
of the supplier form. In there you can fill the E-Fatura Product and E-Fatura
Tax fields. These values will become the default product and tax values for the
invoice lines created from the e-fatura files.

It's also recommended to create default values for these fields. This way the
invoices for all the new suppliers created from the e-fatura file will have an
invoice line with the default product and tax (otherwise the invoices will be
created without lines).

Usage
=====

Available soon.

Known issues / Roadmap
======================

Available soon.

Changelog
=========

5.5.1 (2026-07-31)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Scanning the QR code of a document issued to another company no longer fills
  in the vendor bill: the vendor, the reference and the E-Fatura record are left
  untouched, only the warning is shown.

5.5.0 (2026-07-24)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Add a manual "Scan QR" button to the expense form (same behaviour as the
  vendor bill one), so receipts attached after the expense is created can
  also be scanned. The scan now looks at every attachment of the expense,
  not only the main one.

5.4.0 (2026-07-23)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Rework the QR code detection of vendor bill attachments: decode the images
  embedded in PDFs at native resolution before falling back to page renders,
  enhance low-quality scans (thermal receipts, photos), only pick the fiscal
  QR code when a document carries several, and switch the decoder from
  pyzbar/zbar to OpenCV WeChatQRCode (no OS-level dependency required).
- Scan the Portuguese QR code of expense receipts too (Expenses upload):
  fill the expense total amount, date, vendor and description from the QR
  code data. New dependency on ptplus_expense.
- The opencv-contrib-python-headless python package is an optional
  dependency: when it is not installed the QR code scan is skipped with a
  log warning, uploads and upgrades are never blocked.

5.1.0 (2023-11-16)
~~~~~~~~~~~~~~~~~~~

**Features**

- Initial changelog

Credits
=======

Authors
~~~~~~~

* Exo Software, Lda.

Contributors
~~~~~~~~~~~~

* `Exo Software <https://exosoftware.pt>`_:

  * Pedro Castro Silva
  * André Leite
  * João Costa

* `Growfactor <https://www.growfactor.pt>`_:

  * Álvaro Ribeiro
  * Luís Homem

Maintainers
~~~~~~~~~~~

This module is maintained by Exo Software, Lda.

.. image:: https://exosoftware.pt/logo.png
   :alt: Exo Software
   :target: https://exosoftware.pt
   :width: 100px
