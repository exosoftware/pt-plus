====================
Portugal - Invoicing
====================

This module adds the fields and views that are needed for the base portuguese localization.
The ultimate goal is to allow an organization to change Odoo provider with minimum
impact. Added features/fields include (with no particular order):

* Support for debit notes and simplified invoices (invoice-like document types)
* Support for delivery notes and similar documents
* Pre-defined legally accepted reasons for issuing credit notes, as required for fields 40/41 of the VAT statement (Portaria nº 255/2013).
* Fields required for document signing certification: Hash, HashControl, SystemEntryDate, SourceID, etc...
* Tax related fields:
    Genre (VAT, Stamp duty, etc...)
    VAT type (normal, intermediate, reduced, exempt)
    Country region (Continental Portugal, Azores, Madeira, EC, Outside EC)
    VAT exemption reason (legally accepted reason for issuing VAT exempt invoice lines)
* Account Taxonomies (Portaria nº 302/2016)
* Support for series registration webservices

Change the standard graphical layout and print behaviour of documents that are
controlled by the Portuguese Tax Authorities, namely:


- Add simplified invoices and debit notes
- Credit note accounting is mapped to user-defined refund accounts
- Credit and Debit notes include VAT Adjustment Norms and related info

**Table of contents**

.. contents::
   :local:

Installation
============

Install the module with required dependencies:

* pip install xmlschema unicodecsv zeep
* add the module to an addons folder, restart Odoo, update the addons list and activate
  it.

Usage
=====

Available soon.

Known issues / Roadmap
======================

Available soon.

Changelog
=========

5.1.18 (2026-09-09)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- The QR code, the ATCUD and the certification text are now printed only by
  the reports that reproduce the fiscal document itself. Other printouts of
  the same record, such as the journal entry of an invoice, no longer carry
  them

5.1.16 (2026-08-31)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- The subscription check now reports the Odoo version and edition the database
  is running, so that support no longer has to keep them up to date by hand

5.1.15 (2026-08-27)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Invoices posted automatically, such as the ones issued after an online
  payment, are now signed and numbered under the company that issues them.
  When that company was not the one the automatic process was running under,
  posting stopped with the error "the document is not a fiscal document".
5.1.14 (2026-08-27)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- The subscription check now reports every app authored by Exo Software that is
  installed in the database, and not only the PT+ family, so that support sees
  the whole picture of what is running

5.1.13 (2026-08-24)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Communications with the Tax Authority now give up after 30 seconds. Until
  now, whenever the Tax Authority accepted the connection and then stopped
  answering, the request stayed waiting indefinitely and kept the server
  occupied: a few documents being validated at the same time were enough to
  leave the whole installation without capacity to answer anything, until it
  was restarted by hand. The communication now fails with the usual connection
  timeout message and can be tried again.

5.1.12 (2026-08-20)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- The country ISO codes (three-letter and numeric) are now available on every
  PT+ installation, instead of only on the ones with accounting. The Modelo 30
  needs the numeric code to identify the beneficiary's country.

5.1.11 (2026-08-20)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Documents other than invoices (for example payment receipts) can now
  report withheld amounts in their QR code (field P). Until now these
  documents always showed a zero withholding in the QR code.

5.1.10 (2026-08-18)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Invoices containing a subsection line can now be confirmed. Subsection
  lines are treated like section and note lines: they are no longer
  required to have a product or taxes.

5.1.9 (2026-08-17)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- When the Tax Authority refuses a communication, the failure window now shows
  the whole reason it gave, and not only its first line. Refused credentials, in
  particular, used to show just "An error occurred authenticating the taxpayer",
  while the Tax Authority was also saying whether the password was wrong or the
  access had been blocked, and how many attempts were left

5.1.8 (2026-08-14)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- When a document cannot be communicated to the Tax Authority, the failure
  window now shows the reason the Tax Authority gave, such as its
  authentication service being unavailable. Until now it showed only the text
  "Unknown error when sanitizing", with no clue about what had failed, which
  made these situations impossible to tell apart
- Failures caused by the network or by the Tax Authority being unreachable now
  also explain themselves in the failure window, where before the detail was
  left blank

5.1.7 (2026-08-12)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- The Tax Authority password is now protected also when it is filled in while
  the user is being created. Until now it was only protected when it was typed
  on an already existing user, and a password saved on the creation screen was
  kept readable and made the communications with the Tax Authority fail
- When the stored Tax Authority password cannot be read (for instance because
  it was loaded by an import), the user now gets a message asking to type the
  password again on the user form, instead of a technical error

5.1.6 (2026-07-31)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Issuing fiscal documents (invoices, receipts) is faster, especially on
  databases holding years of documents: finding the previously issued
  document of each series no longer slows down as the history grows

5.1.5 (2026-07-28)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- The "IVA 6% AQ. (OB)" purchase tax is no longer archived, so the reduced rate
  is selectable on vendor bills and usable as an E-Fatura tax mapping default

5.1.4 (2026-07-14)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- The Payment (multi-way) report no longer registers its printed PDF as a
  chatter attachment

5.1.3 (2026-07-13)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- The Invoice/Payment (multi-way) reports only show up in the print menu when
  the document has a source billing set

5.0.7 (2025-10-26)
~~~~~~~~~~~~~~~~~~~
**FIX**

- Ensure consistent behaviour for Integration source billing on payments


4.3.2 (2024-02-02)
~~~~~~~~~~~~~~~~~~~

**Features**

- Added a new permission to enable PT Experimental Features

4.3.1 (2024-01-24)
~~~~~~~~~~~~~~~~~~~

**Features**

- Enhance l10n_pt_cert_service_backend for multicompany support

4.3.0 (2023-11-16)
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
