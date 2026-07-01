
Portugal - E-invoicing (CIUS-PT 2.1.1)
======================================

Adds CIUS-PT enabled invoicing to Odoo according to the CIUS-PT 2.1.1 dated
26-Feb-2021 norm published by the (`eSPap <https://www.espap.gov.pt/spfin/normas/Paginas/normas.aspx>`_).

An XML file will be created and attached to every sales invoice or debit/credit note
and included on the Send. This file can then be manually sent to some e-invoicing brokers.

**Table of contents**

.. contents::
   :local:

Installation
============

Install the module with required dependencies:

* add the module to an addons folder, restart Odoo, update the addons list and activate
  it.

Configuration
=============

For general information regarding e-invoicing in Odoo, please read the
(`online manual <https://www.odoo.com/documentation/19.0/applications/finance/accounting/customer_invoices/electronic_invoicing.html>`_).

After module installation, you'll see a new option in the Accounting tab of the
customer form: Portugal (CIUS-PT). Partners that are marked with this option will
have an XML file attached to its invoices and credit notes when these documents
are posted. This file will also be embedded in the document PDF.

These generated CIUS-PT files, representing the document data according to the
portuguese standards, will be validated against an official schematron
source in order to ensure compliance. When the validation fails, invoices will
not be posted. You can disable this validation if you want to have you invoice
posted despite possible problems in the XML file (not recommended). Just set
the Disable Schema Validation on the Electronic Invoicing options inside the
Portuguese Invoicing settings section.

This module just creates and attaches the XML file. To electronically transmit
it you'll need to install additional modules for specific brokers.

Usage
=====

Just post your invoices as usual and watch the CIUS-PT file be attached to it.

Known issues / Roadmap
======================

Importing CIUS-PT invoices is still WIP.

Changelog
=========

1.1.0 (2023-11-16)
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
  * Diogo Pereira
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

