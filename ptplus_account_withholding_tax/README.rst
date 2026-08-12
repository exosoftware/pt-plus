=========================================
Portugal - Withholding Tax on Payment
=========================================

Portuguese localization for withholding tax on payments, bridging PT+ with the
Odoo withholding tax on payment mechanism.

* Defaults the company "Withholding Tax Base" account to account 242
  (Retenção de impostos sobre rendimentos) when loading a PT+ chart of
  accounts.
* Creates a withholding tax sequence (``RF/``, code ``pt.account.withholding``)
  per company when loading a PT+ chart of accounts.
* Reports withholding only when effectively withheld, at the payment: the
  taxes withheld on payment are deliberately not reported on the invoice's
  SAF-T ``WithholdingTax`` element nor on the QR code withholding amount
  (field P).
* Reports the withholding taxes registered on a payment in the SAF-T
  ``Payment`` element (4.4.4.14 ``WithholdingTax``), one element per tax.
* Doesn't propose payment withholding for taxes already withheld on the
  invoice being paid (an invoice posted before the tax was flagged "Withhold
  On Payment"): withholding twice would pay the vendor short and double the
  withholding statements (Modelo 10/30, monthly statement).
* Shows the taxes withheld on payment in the invoice PDF report totals as
  informational entries after the total, together with the net amount
  payable.

Automatically installed when both ``ptplus_saft`` and
``l10n_account_withholding_tax`` are installed.

**Table of contents**

.. contents::
   :local:

Installation
============

This module is installed automatically when both ``ptplus_saft`` and
``l10n_account_withholding_tax`` are installed.

Usage
=====

Known issues / Roadmap
======================

Available soon.

Changelog
=========

1.0.0 (2026-07-23)
~~~~~~~~~~~~~~~~~~~

**Features**

- Default the company "Withholding Tax Base" account to account 242.
- Create a withholding tax sequence (``RF/``) per company on chart load.
- Report withholding taxes on the SAF-T ``Payment`` element (4.4.4.14
  ``WithholdingTax``): the withholding is only reported when effectively
  withheld, so the invoice's SAF-T ``WithholdingTax`` element and QR code
  field P stay empty for taxes withheld on payment.
- Show the taxes withheld on payment in the invoice PDF report totals, with
  the net amount payable after retention (commercial information only).
- Don't propose payment withholding for taxes already withheld on the invoice
  being paid.
