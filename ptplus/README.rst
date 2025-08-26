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
