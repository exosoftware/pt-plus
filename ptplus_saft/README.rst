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

4.1.7 (2026-07-01)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Adding a VAT to a customer that had none now updates the SAF-T of invoices
  already issued to that customer as "consumidor final".

**Bugfixes**

- Include the accounting data of company branches and sub-branches in the
  Accounting SAF-T. The G/L accounts (opening/period balances), G/L entries and
  balance warnings now cover the export company and its whole ``child_of`` tree
  (the report is filed per taxpayer at the root company) instead of only the
  selected company, for both the extraction and real-time extraction methods.
- Resolve the ``AccountID`` of branch journal lines in the real-time SAF-T
  element via the root company's account codes. Previously the code was read
  under the branch company (which has no ``code_store`` entry), producing an
  empty ``AccountID`` that raised an encoding error and blocked branch moves
  from being posted.

4.1.6 (2026-06-29)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Restrict the imported-SAF-T-elements smart button (both the ``import_saft_id``
  field and the button) on the invoice, partner, account, journal and product
  forms to the accounting Billing group. Previously the
  ``import_saft_id`` field was computed for every user opening those forms,
  raising an access error for users without read access on
  ``l10n_pt.account.saft.import`` (e.g. salespeople).

4.1.5 (2026-06-24)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Report the line ``UnitPrice`` and ``SettlementAmount`` in the company
  (reporting) currency for invoices issued in a foreign currency. ``UnitPrice``
  was previously emitted in the document currency and the discount was
  converted with the exchange rate inverted.
- Report the SAF-T line ``References`` (origin document and correction reason)
  on corrective documents, so credit and debit notes can point at the document
  they correct.

4.1.4 (2026-06-16)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Added a 'Blocked' SAF-T element status that freezes the element and is never
  recomputed. It is set/cleared manually from the invoices and payments list
  ``Action`` menu, and is released only when the document is cancelled.
- Exposed the SAF-T element status as an optional column on the invoices and
  payments lists.
- Added a list action to recompute the SAF-T element on the spot, without
  extracting the SAF-T file.

4.1.3 (2026-01-15)
~~~~~~~~~~~~~~~~~~~

**Improvements**

- Fixed inconsistencies between 'extraction' and 'realtime' SAF-T calculation methods.
- Fixed inconsistencies between ECO taxes in invoices and sale orders.

4.1.2 (2025-11-11)
~~~~~~~~~~~~~~~~~~~
**Features**

- Added special taxes artificial line (IEC/ECO taxes) on Sales Invoices.
- Added artificial Downpayment product, and add it to downpayment invoice and sale order lines (SalesInvoice and WorkDocument).


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
