=========================
Portugal - POS Restaurant
=========================

This module adds all the changes required to make Odoo Point of Sale Restaurant comply
with the Portuguese sales rules and workflow, including:

- Mandatory data on receipts, including QR code and ATCUD
- POS sales support on SAF-T
- (...)

**Table of contents**

.. contents::
   :local:

Installation
============

Add the module to an addons folder, restart Odoo, update the addons list and activate
it.

After installing this module, you must close (and eventually reopen) every POS
session.

Usage
=====

Available soon.

Known issues / Roadmap
======================

The POS needs an internet connection in order to issue invoices.

Changelog
=========

1.1.0 (2026-06-16)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Added the SAF-T element status as an optional column on the POS orders list,
  plus list actions to (un)block and to recompute the element on the spot.

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

  * André Leite
  * Pedro Castro Silva

Maintainers
~~~~~~~~~~~

This module is maintained by Exo Software, Lda.

.. image:: https://exosoftware.pt/logo.png
   :alt: Exo Software
   :target: https://exosoftware.pt
   :width: 100px
