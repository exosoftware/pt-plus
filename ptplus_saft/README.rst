=============================
Portugal - SAF-T PT Statement
=============================

Generate and export the portuguese version of the v1.04 SAF-T file
(Standard Audit File for Tax purposes).

**Table of contents**

.. contents::
   :local:

Installation
============

Install the module with required dependencies:

* pip install unicodecsv
* add the module to an addons folder, restart Odoo, update the addons list and activate
  it.

Usage
=====

Available soon.

Known issues / Roadmap
======================



Changelog
=========

4.1.11 (2026-09-14)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Accounting users without access to the Settings app can export the SAF-T
  again. The export started by checking the installed modules with the current
  user's rights, which only administrators have, so it failed with an access
  error before producing anything.

4.1.10 (2026-08-17)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- A tax with an empty "Label on Invoices" no longer breaks the SAF-T export.
  Until now the file came out without the Master Files section and an encoding
  error was shown; the export now uses the tax name as the description in the
  tax table and adds a warning telling you which tax should be fixed. The same
  applies to a stamp duty tax whose verba has no name.
- More generally, a badly configured tax can no longer void the whole Master
  Files section with an unreadable encoding error. Since the SAF-T tax table
  must report every tax used in the documents, the export now stops with a
  clear message naming the tax(es) that cannot be reported and a button that
  opens them for correction.

4.1.9 (2026-07-31)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Documents of companies that do not use Portuguese Invoicing are no longer
  prepared for the SAF-T. In a database shared with foreign companies (for
  instance a Spanish company alongside the Portuguese one), confirming a journal
  entry in the foreign company failed with a SAF-T validation error and could
  not be posted at all. Only the Portuguese company and its branches are
  reported now.
- Products that were modified after being sold no longer generate a duplicate
  product snapshot every time a new document is issued: the latest snapshot
  is now reused, keeping the products reported in the SAF-T file free of
  repeated entries.

4.1.8 (2026-07-23)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Recompute the payment SAF-T element when the payment is (un)reconciled: on
  real-time companies the element was computed at issuing, before the register
  payment wizard reconciles it with the invoice, and stayed cached empty — the
  payment then silently disappeared from the SAF-T Payments section until a
  manual "Recompute elements" export.

4.1.7 (2026-07-14)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Remove the legacy "Extraction" SAF-T computing method; companies still
  using it are migrated to "Real-time".

**Bugfixes**

- Include the GeneralLedgerEntries section in the Accounting and Integrated
  files, placed before SourceDocuments as the schema requires.
- Don't drop the Customer/Supplier/Product master files when the file has no
  TaxTable (e.g. Accounting exports).
- Read the branches' journal entries when exporting from the root company.
- Declare stamp-duty charge lines (product configured as stamp duty) with
  the line's NS tax and exemption M99.

4.1.6 (2026-07-01)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Adding a VAT to a customer that had none now updates the SAF-T of invoices
  already issued to that customer as "consumidor final".

**Bugfixes**

- Include the accounting data of company branches and sub-branches in the
  Accounting SAF-T. The G/L accounts (opening/period balances), G/L entries and
  balance warnings now cover the export company and its whole ``child_of`` tree
  (the report is filed per taxpayer at the export company) instead of only the
  selected company, for both the extraction and real-time extraction methods.

4.1.5 (2026-06-24)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Preserve an integrated document's ``HashControl`` (SourceBilling=I) in the
  SAF-T export instead of emitting ``0`` (Despacho n.º 8632/2014: collected
  documents are exported as-is).

4.1.4 (2026-06-24)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Report the line ``UnitPrice`` and ``SettlementAmount`` in the company
  (reporting) currency for invoices issued in a foreign currency. ``UnitPrice``
  was previously emitted in the document currency and the discount was
  converted with the exchange rate inverted.
- Report the SAF-T line ``References`` (origin document and correction reason)
  on corrective documents, so credit and debit notes can point at the document
  they correct.

4.1.3 (2026-06-16)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Added a 'Blocked' SAF-T element status that freezes the element and is never
  recomputed. It is set/cleared manually from the invoices and payments list
  ``Action`` menu, and is released only when the document is cancelled.
- Exposed the SAF-T element status as an optional column on the invoices and
  payments lists.
- Added a list action to recompute the SAF-T element on the spot, without
  extracting the SAF-T file.

4.1.2 (2025-11-11)
~~~~~~~~~~~~~~~~~~~
**Features**

- Added special taxes artificial line (IEC/ECO taxes) on Sales Invoices.
- Added artifical Downpayment product, and add it to downpayment invoice and sale order lines (SalesInvoice and WorkDocument).


4.0.1 (2024-01-29)
~~~~~~~~~~~~~~~~~~~

**Features**

- Added a new method to obtain SAF-T using dataport log without using the user interface
  This can be useful for SAF-T extraction automation

4.0.0 (2023-11-16)
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
