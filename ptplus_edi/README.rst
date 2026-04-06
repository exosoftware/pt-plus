
Portugal - E-invoicing (CIUS-PT 2.1.1)
======================================

Adds CIUS-PT enabled invoicing to Odoo according to the CIUS-PT 2.1.1 dated
26-Feb-2021 norm published by the (`eSPap <https://www.espap.gov.pt/spfin/normas/Paginas/normas.aspx>`_).

An XML file will be created and attached to every sales invoice or debit/credit note
and included on the Send by Mail feature. This file can than be manually uploaded to
some e-invoicing brokers.

**Table of contents**

.. contents::
   :local:

Installation
============

Install the module with required dependencies:

* pip install unicodecsv
* add the module to an addons folder, restart Odoo, update the addons list and activate
  it.

Configuration
=============

After module installation you'll see a new option on every sales journal that
belongs to a Portuguese company. It's called CIUS-PT (File)) and is
available on the Electronic Data Interchange section. When active, the CIUS-PT
rules will be enforced and an XML file will be added to every invoice or credit
note issued on the journal. You can have multiple sales journal, some of them
with CIUS-PT activation and others without it.

The generated CIUS-PT files will be validated against an official schematron
source in order to ensure compliance. When the validation fails, invoices will
not be posted. You can disable this validation if you want to have you invoice
posted despite possible problems in the XML file. Just set the Disable Schema
Validation on the Electronic Invoicing options inside the Portuguese Invoicing
settings section.

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

