======================
Portugal - SDR / Volta
======================

This module implements the Portuguese Deposit Return Scheme (*Sistema de
Depósito e Reembolso*, SDR / "Volta"), in force from 10 April 2026.

It adds a separate, VAT-exempt deposit line ("Embalagens SDR/Volta") to
purchase and sales invoices, aggregating the quantities of the products
flagged as subject to SDR.

Configuration
=============

Enable the module from *Settings > Accounting > Portugal > SDR / Volta*.
There you can pick the default SDR product and the calculation algorithm.

Flag the beverage products subject to SDR with the *SDR / Volta* checkbox
on the product form.

Usage
=====

On purchase and sales invoices the deposit line is recomputed automatically
when invoice line quantities or products change. It can also be recomputed
on demand with the *Compute SDR* button.

The deposit amount is not subject to VAT; it is reported in the SAF-T file
with exemption reason M99.

Changelog
=========

19.0.1.0.1 (2026-07-10)
-----------------------

**Bugfixes**

- Do not crash on install when the ``product.product_category_services``
  category has been deleted or merged in the target database; resolve it
  defensively (matches Odoo core's own pattern).
