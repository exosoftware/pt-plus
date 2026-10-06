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
