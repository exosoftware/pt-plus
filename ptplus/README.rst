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

5.1.6 (2026-08-14)
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

5.1.5 (2026-08-12)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- The Tax Authority password is now protected also when it is filled in while
  the user is being created. Until now it was only protected when it was typed
  on an already existing user, and a password saved on the creation screen was
  kept readable and made the communications with the Tax Authority fail
- When the stored Tax Authority password cannot be read (for instance because
  it was loaded by an import), the user now gets a message asking to type the
  password again on the user form, instead of a technical error

5.1.4 (2026-07-31)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Issuing fiscal documents (invoices, receipts) is faster, especially on
  databases holding years of documents: finding the previously issued
  document of each series no longer slows down as the history grows

5.1.3 (2026-07-14)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- The Invoice/Payment (multi-way) reports no longer register their printed
  PDF as a chatter attachment

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
