==============================
Portugal - SDR / Volta on PoS
==============================

This module extends the Portuguese Deposit Return Scheme (*Sistema de
Depósito e Reembolso*, SDR / "Volta") to the Point of Sale.

It auto-builds a separate deposit line ("Embalagens SDR/Volta") on PoS
orders, aggregating the quantities of the products flagged as subject to
SDR, mirroring the behaviour already available on purchase and sales
invoices.

Configuration
=============

This module installs automatically when both *ptplus_sdr* and *ptplus_pos*
are installed.

The default SDR product, the calculation algorithm and the *SDR / Volta*
flag on products are configured as described in the *ptplus_sdr* module.

Usage
=====

On PoS orders the deposit line is built and recomputed automatically as
products subject to SDR are added or their quantities change.