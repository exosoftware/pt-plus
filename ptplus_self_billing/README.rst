=======================
Portugal - Self-billing
=======================

Install this module to allow legally compliant self-billing, which is an
invoicing process where a company invoices itself on behalf of a supplier.

**Table of contents**

.. contents::
   :local:

Installation
============

Add the module to an addons folder, restart Odoo, update the addons list and
activate it.

Configuration
=============

* To allow self-billing invoices for a supplier, check its Self-billing field
  on the supplier card
* If you're planning on transmitting the self-billing invoices via webservices
  to the Tax Authority you should fill the vendor's credentials (see Roadmap)
* Create a fiscal document type for that partner's self billing invoices. Don't
  forget to check the self-billing flag and fill the self-billing partner. You
  must also create a new sequence for the vendor's self-bills.

Usage
=====

To issue and print self-billing invoices:
* On a vendor bill, activate the Self-billing option. You'll then be able to
  select the fiscal document type you created on the previous step.
* Validate the invoice.
* Use the regular Print menu options to print the self-billing invoice. The
  document will look as if the vendor is the issuer and your company is the customer.

To export the SAF-T file for a self-billing partner:
* Open the SAF-T PT exporting wizard
* Select Self-billing on the Type field
* Select the specific self-billing partner
* Select the dates and other usual options and export

Known issues / Roadmap
======================

The self-billing series registration webservices are not yet implemented.

Changelog
=========

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

- Pedro Castro Silva (`Exo Software <https://exosoftware.pt>`_)
- André Leite (`Exo Software <https://exosoftware.pt>`_)
- João Costa (`Exo Software <https://exosoftware.pt>`_)

with the invaluable help of

- Álvaro Ribeiro (`Growfactor <https://www.growfactor.pt>`_)
- Luís Homem (`Growfactor <https://www.growfactor.pt>`_)

Maintainers
~~~~~~~~~~~

This module is maintained by Exo Software, Lda.

.. image:: https://exosoftware.pt/logo.png
   :alt: Exo Software
   :target: https://exosoftware.pt
   :width: 100px














Installation
============

Just install.

Configuration
=============

* To allow self-billing invoices for a supplier, check its Self-billing field.
* If you're planning on transmitting the self-billing invoices via webservices to the Tax Authority you should fill the vendor's credentials.
* Create a fiscal document type for that partner's self billing invoices. Don't forget to check the self-billing flag and fill the self-billing partner. You must also create a new sequence for the vendor's self-bills.

Usage
=====

To issue and print self-billing invoices:
* On a vendor bill, activate the Self-billing option. You'll then be able to select the fiscal document type you created on the previous step.
* Validate the invoice.
* Use the regular Print menu options to print the self-billing invoice. The document will look as if the vendor is the issuer and your company is the customer.

To export the SAF-T file for a self-billing partner:
* Open the SAF-T PT exp0orting wizard
* Select Self-billing on the Type field
* Select the specific self-billing partner
* Select the dates and other usual options and export




