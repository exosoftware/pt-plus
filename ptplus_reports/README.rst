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

1.3.0 (2026-08-13)
~~~~~~~~~~~~~~~~~~~

**Features**

- Online statements can now fetch the payment reference (payment guide) from the
  Tax Authority and email the Tax Authority documents (submission receipt or
  payment reference) to chosen recipients, with the PDF attached.

**Bugfixes**

- Consulting the submitted declarations online now works when it is done on
  behalf of the taxpayer by the certified accountant: the taxpayer number is now
  sent in the request, which the Tax Authority requires (it was rejected before).
- The Tax Authority error message shown after a failed submission is now
  displayed once and without raw formatting tags around the text.
- The option to email the Tax Authority documents now appears only after a
  receipt or payment reference has been fetched, not while an error is shown.

1.2.1 (2026-08-12)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- The Certified Accountant password is now protected also when it is filled in
  while the user is being created. Until now it was only protected when it was
  typed on an already existing user, and a password saved on the creation
  screen was kept readable and made the statement submissions fail
- When the stored Certified Accountant password cannot be read (for instance
  because it was loaded by an import), the user now gets a message asking to
  type the password again on the user form, instead of a technical error

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
