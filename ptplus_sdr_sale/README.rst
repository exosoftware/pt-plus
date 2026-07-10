===============================
Portugal - SDR / Volta on Sales
===============================

This module extends the Portuguese Deposit Return Scheme (*Sistema de
Depósito e Reembolso*, SDR / "Volta") to sales orders.

It is a bridge between ``ptplus_sdr`` and ``sale``: it rebuilds the
VAT-exempt SDR / Volta deposit line on sale orders the same way
``ptplus_sdr`` does on invoices, aggregating the quantities of the products
flagged as subject to SDR. It installs automatically whenever both
``ptplus_sdr`` and ``ptplus_sale`` are present.

Usage
=====

On sale orders the deposit line is recomputed automatically when order line
quantities or products change. It can also be recomputed on demand with the
*Recompute SDR* button.

Configuration is shared with ``ptplus_sdr``; see that module's settings.
