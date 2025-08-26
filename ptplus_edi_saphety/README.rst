
Portugal - Saphety EDI
======================

Allows Odoo to electronically transmit CIUS-PT enabled invoices to the
Saphety EDI platform in order to have them delivered to your customer.


Installation
============

Just install.

Configuration
=============

Before setting up this module, you'll need to install its base module:
Portugal - E-invoicing CIUS-PT.

After this module installation you'll see a new option on every sales journal
that belongs to a Portuguese company. It's called CIUS-PT (Saphety) and is
available on the Electronic Data Interchange section. Set it if you wish to
deliver the CIUS-PT XML file to your customers through the Saphety brokerage
services. Keep in mind that only one CIUS-PT related option is allowed to be
selected.

You must insert your Saphety platform credentials on the Saphety EDI zone of
the Portugal section on the Invoicing/Accounting settings. For testing purposes,
you can use these credentials:

- username: sin_api_documentation_user@saphety.com
- password: request_password




Usage
=====

Select a Saphety enabled journal on every invoice you want to transmit to the
Saphety broker. After that, just post the invoice as you normally do. Posted
invoices will display a note saying they're set to be transmitted to Saphety.

An asynchronous multi-step process is then performed automatically by Odoo:

* **Request a document submission**: Odoo sends the XML to Saphety and receives
  a Request Id. Saphety will then queue the request and have the document
  validated to determine if the submission request can be accepted.
* **Check for request submission status**: Odoo keeps checking the submission
  status until it's Finished. A Document Id will than be received.
* **Check for document integration status**: Odoo keeps checking the
  integration status until it's Received or Paid (by the customer).

Odoo maintains a common cron job for all e-invoicing interactions and these
processes are no exception. Each interaction is executed on a cron task. This
means that the full workflow can take a few hours to complete, depending on the
cron periodicity. If you are in a hurry, you can go to invoice page on the
backend and keep clicking on the Send Now link (on the top of page), until the
workflow is completed. In either case, you can follow up on the workflow on the
EDI Documents separator of the invoice (in developer mode). To see all the
details please enable all the Saphety related columns.

In complex electronic invoicing scenarios you may wish to set a default broker
for each customer. To do that, you can select a Default EDI Format on the
Invoicing tab of the partner form. After that, the default journal for the
partner invoices will be based on that choice.


Credits
========

Contributors
------------

* `Exo Software <https://exosoftware.pt>`_:

  * Pedro Castro Silva
  * André Leite
  * João Costa

Maintainer
----------

This module is maintained by Exo Software, Lda.

.. image:: https://exosoftware.pt/logo.png
   :alt: Exo Software
   :target: https://exosoftware.pt
   :width: 100px
