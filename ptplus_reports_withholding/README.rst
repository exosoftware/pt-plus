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
