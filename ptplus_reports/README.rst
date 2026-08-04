=======================================
Portugal - Statements/Reports
=======================================

Base module for the accounting and tax related statements and reports.


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

1.2.0 (2026-07-15)
~~~~~~~~~~~~~~~~~~~

**Features**

- Add the AT webservice submission core: multi-actor authentication (taxpayer +
  certified accountant) and a dedicated "Submit" step in the statement wizard
  (validate / submit online, fetch receipt). The AT "Obrigações Acessórias" (OA)
  ``WebserviceOA`` client and a reusable ``l10n_pt.oa.statement.mixin`` let every
  OA statement (Modelo 10, Modelo 30, DMR, ...) reuse submit / validate /
  consult / receipt / errors by declaring only its model code and file format.

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
