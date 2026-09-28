======================
Portugal - Expenses
======================

Expense related customizations for Exo Software, including:

- Recording distance to the company head office in partner form so that it is
  used when filling traveling expenses to that partner
- A legally compliant report for Travel Related Expenses

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

1.5.0 (2026-09-10)
~~~~~~~~~~~~~~~~~~

**Improvement**

- The Expense Reimbursement setting is now shown to every Portuguese company,
  whether or not it issues its invoices with Portuguese Invoicing turned on.
  Until now it only appeared with Portuguese Invoicing active.

1.4.1 (2026-09-10)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Reconciling a payment is no longer slow on companies with a large accounting.
  The expense state follows the settlement of the debt transfer entry, so every
  reconciliation had the system look through all the journal entries of the
  database to find the transfers concerned. On a company with millions of
  entries that search took around ten seconds and ran several times per
  reconciliation, which is what made assigning an outstanding payment or
  undoing a bank statement reconciliation take up to a minute. The search is
  now immediate, whether or not the company uses expense reimbursements.

1.4.0 (2026-08-04)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- An employee-paid expense without a Vendor is no longer blocked when it is
  posted: it now follows the standard Odoo posting (a posted entry on the
  employee). The vendor bill with the reimbursement of the employee keeps being
  created whenever the expense has a Vendor.

1.3.0 (2026-07-28)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- The Reimbursement Account can now also be an account payable (e.g. 278121),
  besides a current liabilities account.

1.2.0 (2026-07-24)
~~~~~~~~~~~~~~~~~~~

**Features**

- Employee-paid expenses of Portuguese companies now generate a draft vendor
  bill on the real vendor of the expense instead of a posted receipt on the
  employee. When the bill is posted, its payable balance is automatically
  transferred to the employee on the new "Reimbursement Account" (accounting
  settings) through a reconciled debt transfer entry, and the expense is only
  marked as Paid once that debt to the employee is settled.
- The Vendor field of the expense is now also visible for employee-paid
  expenses of Portuguese companies.
- New "Reimbursement Partner" field on vendor bills.

1.1.0 (2024-01-02)
~~~~~~~~~~~~~~~~~~~

**Features**

- Added "Own Vehicle Travel Report" for tracking and calculating employee travel reimbursements.

1.0.0 (2023-12-28)
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
  * João Costa
  * André Leite

Maintainers
~~~~~~~~~~~

This module is maintained by Exo Software, Lda.

.. image:: https://exosoftware.pt/logo.png
   :alt: Exo Software
   :target: https://exosoftware.pt
   :width: 100px
