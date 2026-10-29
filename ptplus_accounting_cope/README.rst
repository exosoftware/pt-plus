=======================================
Portugal - COPE Report
=======================================

Add legally compliant COPE reports.

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

1.1.0 (2026-10-15)
~~~~~~~~~~~~~~~~~~

**Features**

- Accounts can now have a COPE code. Every account with a COPE code is reported
  in the COPE statement with the current balance of each foreign partner,
  whatever the statement period. Open partner balances that were never settled
  are now reported only through these accounts.
- Payments can now be given the COPE active country, which the statement
  requires for some statistical codes (securities, real estate, factoring,
  travel and tourism, construction and air transport). The field only shows
  when the payment's COPE code needs it, and the COPE code itself is hidden for
  partners established in Portugal.
- The journal items list has a new optional COPE Code column, with the code
  each item is reported with: the one set on the payment, or else the
  partner's or the company's default code for receivables and payables.
- The statement detail of each line now opens the journal items that gave rise
  to it.

1.0.1 (2026-10-13)
~~~~~~~~~~~~~~~~~~

**Bugfixes**

- The COPE report now includes the balances and payments of the company's
  branches. Exporting the XML file no longer fails when more than one company
  is enabled in the company selector, and the XLS file now lists only the
  operations of the company and its branches, instead of those of every
  company enabled in the selector.

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
  * Diogo Pereira
  * João Costa

Maintainers
~~~~~~~~~~~

This module is maintained by Exo Software, Lda.

.. image:: https://exosoftware.pt/logo.png
   :alt: Exo Software
   :target: https://exosoftware.pt
   :width: 100px
