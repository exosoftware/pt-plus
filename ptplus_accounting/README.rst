==========================
Portugal - Full Accounting
==========================

The base module for handling Portuguese full accounting in Odoo. Mods include:

- SNC taxonomy support
- a template based account balance transfer tool. A template for P/L Calculation
  is included for every company.
- new journal types: p/l calculation, fiscal year regularization and adjustment
- a report for printing journal entries
- vat adjustment norms to be applied on credit and debit notes
- equity tags, that classify the movements of the class 5 accounts by the
  nature of the change, for the IES statement of changes in equity

**Table of contents**

.. contents::
   :local:

Installation
============

Add the module to an addons folder, restart Odoo, update the addons list and activate
it.

The installation process creates a balance transfer template for P/L calculation
on every company that has a CoA installed. The same template will be automatically
installed on new companies upon CoA creation. This template has 3 transfers:

* Income and Expense (6 and 7) to 811 - Results before taxes
* Tax estimate and cut off taxes from 812 into 818 - Net result
* 811 - Results before taxes into 818 - Net result

Configuration
=============

If for any reason, the P/L calculation is not installed on a company you can try
to manually create it using the option available on the Action button on the
company form.

Usage
=====

Available soon.

Known issues / Roadmap
======================

Available soon.

Changelog
=========

5.4.0 (2026-10-28)
~~~~~~~~~~~~~~~~~~~

**Features**

- Two new VAT adjustment norms in favor of the State are available on vendor
  credit notes: "Artigo 6.º do Decreto-Lei n.º 198/90" (sales to national
  exporters) and "Decreto-Lei n.º 19/2017" (e-Taxfree). They match the new
  fields of the annex of field 41 of the VAT periodic statement.

5.3.6 (2026-10-28)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- The balance transfers of a company with branches now clear each branch's
  balances in an entry of the branch itself. Until now the whole transfer was
  recorded in the main company, so the branch kept its balances and the main
  company got the opposite ones. After the closing of the income and expense
  accounts, this showed as two "Result Brought Forward" lines in the next
  year's trial balance, one per company. The destination account still
  follows the balance of the company and its branches together, so, for
  instance, VAT recoverable on a branch reduces the VAT payable.
- A balance transfer run on a branch, such as the VAT return of a foreign VAT
  branch, now only takes that branch's balances. It no longer includes those
  of the main company and the other branches.
- Running, confirming or cancelling a balance transfer now requires the
  company and all its branches to be selected in the company selector, as
  the branches' entries are not reachable otherwise.

5.3.5 (2026-10-27)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- The taxonomy setup on the selected accounts no longer fails with an error
  when the selection includes an account without a code. Such accounts are
  now left unchanged, and the other accounts get their taxonomy as usual.

5.3.4 (2026-10-23)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- The SNC Base and SNC Microentities charts of accounts now set the SAF-T
  taxonomy on their accounts when they are loaded, including the bank,
  outstanding receipts and payments, bank suspense and liquidity transfer
  accounts. Companies that already have one of these charts, when the full
  accounting is installed or updated, get the taxonomy on the accounts that
  don't have one yet; the taxonomies already set are kept.

5.3.3 (2026-10-15)
~~~~~~~~~~~~~~~~~~~

**Features**

- New VAT adjustment norm "Verba 2.42 da Lista I", for the VAT adjustments of
  artigo 11.º do Decreto-Lei n.º 97/2026, de 20 de maio, which the periodic VAT
  return reports in the field 40 and field 41 annexes since 2026-07-01
  (Portaria n.º 298/2026/1, de 16 de julho). It can be chosen on credit and
  debit notes, in favor of the company or of the State.

5.3.2 (2026-10-14)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- When creating a credit note from an invoice, the "VAT Adjustment Norm" field
  now only offers the norms that fit that credit note, as the credit note form
  already did.

5.3.1 (2026-10-13)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- The balance transfers (such as the VAT settlement or the closing of the
  income and expense accounts) now also clear the balances of the company's
  branches. Until now only the entries of the main company were transferred,
  so the branches' balances were left in the source accounts.

5.3.0 (2026-09-28)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- The nature of the change on the journal items of the class 5 accounts is now
  chosen in a field of its own, "Equity Change", instead of the analytic
  distribution: equity is not analytic accounting of the company, and the
  analytic plan and its tags were being used for something they are not. The
  options are the same as before, one per line of the Statement of Changes in
  Equity, and everything else keeps working as it did: the field is required
  to post a class 5 item, it can be shown as a column on the journal items
  list and used to group them, and an amount split over two natures is still
  entered as two lines.
- Items classified through the old analytic tags are no longer read by the
  statement: they have to be classified again in the new field. The analytic
  plan "Capital Próprio - DACP" and its tags are no longer created, and the
  ones already in the database are left untouched.

5.2.0 (2026-09-17)
~~~~~~~~~~~~~~~~~~~

**Features**

- Equity tags: every journal item of a class 5 account is now tagged with the
  nature of the change (Subscrições de capital, Distribuições, Alterações de
  políticas contabilísticas and the remaining ones of the official model),
  which is what allows the Statement of Changes in Equity to report it on the
  right line. Movements between accounts of the same nature are tagged as
  having no impact on the statement.
- The tag is required on every way in which a class 5 account can be used:
  journal entries, customer invoices, vendor bills, expenses and sales
  orders. Entries can no longer be posted without exactly one tag, whether
  they are entered by hand, by import or by an integration. An amount split
  over two natures is entered as two lines, one per tag.
- The tags and the plan are records of the statement, not analytic accounting
  of the company: they cannot be renamed, archived nor deleted, and the plan
  is kept out of the analytic plans list. Without this, a tag put aside would
  quietly take the line it feeds down to zero. The tags keep being offered on
  the journal items of the class 5 accounts as before.

5.1.2 (2026-08-20)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- The country ISO codes moved to the base module of the localization. Nothing
  changes for you: they keep working exactly as before.

5.1.1 (2026-08-18)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Balance transfers now move a net debit balance to the "Credit Destination"
  account instead of always using the "Debit Destination". In the VAT
  settlement model, a period with VAT in the company's favour is now
  transferred to account 2437 (IVA - A recuperar) instead of 2436
  (IVA - A pagar).

5.1.0 (2026-04-13)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Allow partial refunds in the periodic statement.

**Bugfixes**

- Fix singleton error when writing the name of multiple journal items at once
  (e.g. generating deferral entries from the Deferred Expense/Revenue reports).

5.0.0 (2023-11-16)
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
  * João Costa
  * André Leite

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
