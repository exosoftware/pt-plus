================
Portugal - Stock
================

Portuguese localization of stock and product movement handling. The feature list includes:

- Legally valid deliveryslip issuing
- Electronic Movement of Goods reporting to the Tax Authtority
- Mandatory end-of-year stock reporting

**Table of contents**

.. contents::
   :local:

Installation
============

Add the module to an addons folder, restart Odoo, update the addons list and activate
it.

Usage
=====

Available soon.

Known issues / Roadmap
======================

The end-of-year stock reporting is not yet valued.

Changelog
=========

5.1.8 (2026-07-14)
~~~~~~~~~~~~~~~~~~

**Bugfixes**

- The Delivery Slip (multi-way) report no longer registers its printed PDF as
  a chatter attachment

5.1.7 (2026-07-07)
~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Printed transport documents now source their loading/unloading partners from
  the same computed fields as the AT webservice communication, so an unknown
  destination is no longer rendered as the company address.

5.1.6 (2026-07-07)
~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Omit CustomerAddress and AddressTo from the AT transport document
  communication when the destination is unknown (no partner nor destination
  warehouse on the picking), instead of sending incomplete or company-fallback
  addresses; SAF-T exports report the unloading place as unknown accordingly.

5.1.5 (2026-06-16)
~~~~~~~~~~~~~~~~~~

**Improvement**

- Added the SAF-T element status as an optional column on the transfers list,
  plus list actions to (un)block and to recompute the element on the spot.

5.1.3 (2026-06-03)
~~~~~~~~~~~~~~~~~~

**Features**

- Allow receptions to issue transport documents: selecting a document type on an incoming picking marks it as a fiscal document. Return notes (GD) now apply to receptions and asset transport notes (GA) accept any operation except deliveries.
- Report the transport movement direction following the actual goods flow, so a reception loads at the counterparty and unloads at our warehouse.

5.1.1 (2026-01-15)
~~~~~~~~~~~~~~~~~~~
**Improvement**

- Change Inventory Statement calculation to stock move lines, and include components and products in transformation (production).


5.1.0 (2025-11-11)
~~~~~~~~~~~~~~~~~~~

**Features**

- Implement SAF-T elements logic with real-time and delayed validations.

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
