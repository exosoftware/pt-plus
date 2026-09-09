=======================================
Portugal - Withholding Tax Statements
=======================================

Add legally compliant income and withholding tax related statements and reports.

* Annual Withholding Statement
* Monthly Withholding Statement
* Modelo 30
* Modelo 10

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

1.4.2 (2026-08-20)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- The tabs of the monthly statement and of the income statement are now shown in
  your language, instead of always in English.

1.4.1 (2026-08-20)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- The withholding statements no longer require the accounting modules to be
  installed: they are part of the invoicing offer and work on their own.

1.4.0 (2026-08-19)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Monthly Withholding Statement: the statement now warns you when a credit note
  was posted on a period other than the one of the invoice it corrects, listing
  the credit notes that don't belong to the period being filed and the ones,
  from later periods, that do. The withholding is due on the period of the
  invoice, so those periods have to be filed again as a replacement statement.

**Bugfixes**

- Modelo 30: filling the statement no longer fails with a technical error when
  the PT+ accounting module isn't installed: it is now installed along with this
  one, since the beneficiary's country code (Quadro 08, field 33) comes from it.

- Modelo 30: the taxation regime (Quadro 08, field 36) is now taken from the
  withholding tax used on each line, instead of always being reported as
  "01 - Tributação nos termos dos Códigos do IRS e/ou IRC". Fill the
  **Withholding Taxation Regime** field on your withholding taxes; the
  statement now warns you when it is missing.

1.3.0 (2026-07-15)
~~~~~~~~~~~~~~~~~~~

**Features**

- Modelo 10: submit / validate / consult / receipt / errors online through the
  AT "Obrigações Acessórias" webservice.

**Improvement**

- Reuse the shared ``l10n_pt.oa.statement.mixin`` from ptplus_reports for the OA
  webservice; each model only declares its model code and file format (Modelo 30
  ``M30`` XML, Modelo 10 ``M10`` TXT).

1.2.0 (2026-07-14)
~~~~~~~~~~~~~~~~~~~

**Features**

- Modelo 30: submit, validate, consult and fetch the receipt online through the
  AT "Obrigações Acessórias" webservice, reusing the generated declaration XML.

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
