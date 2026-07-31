================
Portugal - Sales
================

This module adds all the changes required to make Odoo comply with the
Portuguese sales rules and workflow, including:

- Quotations and orders are digitally signed as requested by the PT Tax Authority
- Quotation and order printed reports obey the same rules that invoices do
- Quotations and orders have separate serial numbers
- Keep a copy of all printed quotations.
- Set the sequence number on quotation/order on print/confirm and not on creation.
- Prevent changes on printed/confirmed orders
- Prevent quotations/orders from being reset to the draft state.
- Quotations and orders are reported on the SAF-T file

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

Changelog
=========

5.1.6 (2026-07-30)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- New ``_pt_needs_order_document()`` hook so that sector specific working
  documents (e.g. the insurance premium receipts) can be confirmed and invoiced
  without being turned into an order (NE) document

5.1.5 (2026-07-30)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Working documents that have been invoiced now report the SAF-T
  ``WorkStatus`` ``F``, as required by Portaria 302/2016 (field 4.3.4.3.1);
  they were always reported as ``N``. It applies as soon as an invoice (``FT``,
  ``FS`` or ``FR``) is issued, even on a partial invoicing, and goes back to
  ``N`` if that invoice is cancelled.

5.1.4 (2026-07-14)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- SAF-T: taxes referenced by the exported Working Documents are now listed
  in the TaxTable master file.

5.1.3 (2026-07-14)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- The Sale Document (multi-way) report no longer registers its printed PDF as
  a chatter attachment

5.1.2 (2026-07-13)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- The Sale Document (multi-way) report only shows up in the print menu when
  the order has a source billing set

5.1.1 (2026-06-16)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Added the SAF-T element status as an optional column on the sale orders list,
  plus list actions to (un)block and to recompute the element on the spot.

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
