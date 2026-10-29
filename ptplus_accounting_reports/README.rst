==========================================
Portugal - Accounting Reports & Statements
==========================================

Add legally compliant Portuguese financial and tax statements, such as:

* Trial Balance
* Balance Sheet
* Profit & Loss
* Statement of Changes in Equity
* VAT Periodic Statement
* VAT Recapitulative Statement
* VAT Annual Statement
* Monthly Stamp Duty Statement (DMIS)

**Table of contents**

.. contents::
   :local:

Installation
============

Add the module to an addons folder, restart Odoo, update the addons list and activate
it.

Usage
=====

Known issues / Roadmap
======================

Available soon.

Changelog
=========

1.9.0 (2026-10-28)
~~~~~~~~~~~~~~~~~~~

**Features**

- The VAT periodic statement now fills in the "Regularizações abrangidas pela
  verba 2.42 da lista I" table of the annexes of fields 40 and 41, by year and
  tax period of the corrected document, and includes it in the XML file. Before,
  a warning asked to fill in this table by hand on the Portal das Finanças.
- The annex of field 41 now fills in the new fields for the adjustments under
  "Artigo 6.º do Decreto-Lei n.º 198/90" (fields 3C/4C) and "Decreto-Lei n.º
  19/2017" (fields 3D/4D), and includes them in the XML file.

1.8.0 (2026-10-27)
~~~~~~~~~~~~~~~~~~~

**Features**

- The Trial Balance can now be exported to PDF, with the same columns and lines
  as on screen. Each page shows the date and time the report was issued, and
  the XLSX export shows them too.
- The Trial Balance now only reports the accounts of classes 1 to 8 of the SNC
  chart of accounts. Accounts created outside these classes are left out of the
  report and of its total.

1.7.1 (2026-10-23)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- The Trial Balance could not be computed when there were invoices with
  section or note lines in the period: an error was shown instead of the
  report. These lines carry no amounts and are now left out.

1.7.0 (2026-10-21)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- The Trial Balance now groups the accounts by the account groups of the chart
  of accounts (class, then each level below it), as the native trial balance
  does. Each group has a subtotal line with the initial balance, the debit, the
  credit and the final balance of its accounts, on screen and in the XLSX
  export, and the movements behind each subtotal can be opened from it.

1.6.0 (2026-10-15)
~~~~~~~~~~~~~~~~~~~

**Features**

- The Depreciation and Amortization Map (Modelo 32) now has its own entry in the
  Portuguese statements menu, next to the other accounting statements. Until now
  it was one of the statement types of the Tax Statements wizard. It is computed
  and exported as before.

1.5.0 (2026-10-14)
~~~~~~~~~~~~~~~~~~~

**Features**

- The Trial Balance now shows, for each account, the initial balance, the debit
  and credit of the period and the final balance, with a total line at the end,
  on screen and in the XLSX export. The start date of the period can be chosen
  again.
- New Trial Balance options: compute it before the P/L calculation (apuramento
  de resultados), leaving out the P/L calculation entries of the period, and
  detail the receivable and payable accounts by partner and the accounts with
  products by product.

1.4.2 (2026-10-13)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- The Balance Sheet, the Profit & Loss, the Statement of Changes in Equity
  and the Exploration Map now include the journal entries of the company's
  branches, as the VAT statements already did. Until now they only reported
  the entries of the main company.
- The Trial Balance now also includes the branches that are not enabled in
  the company selector.

1.4.1 (2026-10-02)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- The new VAT Recapitulative Statement no longer fails to compute when the
  Portuguese sales app is installed.

1.4.0 (2026-09-29)
~~~~~~~~~~~~~~~~~~~

**Features**

- New VAT Periodic Statement (Declaração Periódica do IVA) under Portugal
  Statements > Taxes, on the same screen as the other statements: choose the
  period, compute, review the fields of the rosto and of the annexes (fields
  40 and 41, the refund annexes of customers and vendors, and the Anexo R)
  on their own tabs, open the journal items behind any field, then export
  the XML file for the Portal das Finanças or print the official form. The
  Anexo R of the operations located in the other regions is computed
  together with the statement, so it no longer has to be extracted region by
  region first.
- The excess to carry forward (field 61) and the recapitulative total
  (field 7) are read from the Dataport Log of the previous VAT statement and
  of the recapitulative statement of the same period, as before, and can be
  changed before computing.
- New VAT Recapitulative Statement (Declaração Recapitulativa) on the same
  screen, exported to the XML file of the Portal das Finanças.
- The former statements under "Tax Statements" remain available for now.
  Both versions can be extracted for the same period to compare the figures
  before the old ones are retired.
- The Exploration Map and the Statement of Changes in Equity can now be
  closed with the "log on close" option: the Dataport Log did not know
  those statement types.

1.3.1 (2026-09-28)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- The changes of the period now come from the "Equity Change" field of the
  journal items instead of the analytic tags. Items still classified through
  the old tags are no longer reported, so they have to be classified again in
  the new field.

1.3.0 (2026-09-21)
~~~~~~~~~~~~~~~~~~~

**Features**

- New statement: Demonstração das Alterações no Capital Próprio, the quadro
  04-A of the IES. It is printed on the official model, with the eleven
  columns of equity and the position at the beginning and at the end of the
  period, and can also be exported to Excel.
- The changes of the period come from the nature of the change set on the
  entries, so each movement is reported on the line of its nature. Accounts
  that are classified but outside the statement mapping are listed on screen
  instead of going unreported.

1.2.0 (2026-07-26)
~~~~~~~~~~~~~~~~~~~

**Features**

- Trial Balance statement: reports the closing balance of each account as of the
  selected date, with XLSX export. Unlike the remaining IES statements it works
  account by account, without any taxonomy mapping.

1.1.0
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Warn in the Profit & Loss and Balance Sheet statements when accounts 31 or 38
  still hold a balance, since they must be regularized at year-end and otherwise
  make the statement figures incorrect.

1.0.0
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
