===================
Portugal - E-Fatura
===================

Synchronize supplier invoices the Tax Authority website or from an
E-Fatura .csv file:

* For every line in the e-fatura file, a new draft vendor bill or refund will
  be created if there isn't one already inserted with the same vendor and
  vendor reference.
* The vendor itself will also be created if necessary.
* If an e-fatura document already exists in the database, a warning will be
  displayed if its values don't match the e-fatura values.
* The relevant invoice data is saved in a custom table containing all the
  imported e-fatura lines so that the user can check at any time if the
  vendor invoices match their e-fatura data.

**Table of contents**

.. contents::
   :local:

Installation
============

Install the module with required dependencies:

* pip install bs4, requests_html
* add the module to an addons folder, restart Odoo, update the addons list and activate
  it.

Configuration
=============

The E-Fatura block of the Accounting settings holds the default journal used for
the vendor bills created from the e-fatura data, plus a 'Configure Mappings'
button that opens the E-Fatura tax mapping table. The same table, filtered on a
single vendor, is reachable from the E-Fatura section of the vendor form.

Every tax reported by the synchronization is matched against that table to find
the tax and the product to apply on the vendor bill lines. A mapping can be
matched on the reported rate, tax genre, rate type, exemption reason, country,
region and rate item; criteria left empty match any value. Of the mappings that
match, the first one from the top of the table applies, so drag a mapping up to
give it precedence. A mapping set for specific vendors starts above the generic
ones for that reason.

Portuguese companies start with four mappings covering the mainland VAT purchase
rates: 23%, 13%, 6% and 0%, all on the generic Expenses product.

A document is only turned into a vendor bill once every tax it reports has a
mapping with a product; otherwise it is flagged with a warning banner listing
what is missing, so no bill is created whose total doesn't match the E-Fatura
document. Those documents are reachable through the 'Missing Tax Mapping' filter
and through the import wizard, and each e-fatura line has a button that opens a
mapping prefilled with the criteria the AT reported for it. Stamp duty is the
usual case: the chart of accounts ships no stamp duty tax, so one has to be
created (tax group ``tax_group_is``) and mapped to its rate and verba.

Usage
=====

Available soon.

Known issues / Roadmap
======================

Available soon.

Changelog
=========

5.8.0 (2026-08-19)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- The E-Fatura synchronization now collects the documents through the Tax
  Authority webservice instead of reading the E-Fatura portal pages. The daily
  limit of 300 documents the portal imposes is gone, and a period covering
  several months is fetched month by month without any action from you.
- The synchronization now runs in the background. The import window tells you
  it is collecting and fills itself in with the usual result as soon as it
  finishes, without you having to do anything. A company with thousands of
  documents a month no longer risks the operation being cut short, and one that
  is interrupted picks up where it stopped instead of starting over.
- A new "Automatic E-Fatura Synchronization" option, in the E-Fatura section of
  the Accounting settings, collects the documents on its own, without anyone
  asking for it. Each run collects the last 30 days, so a document a vendor
  only communicated to the Tax Authority now is still picked up; a longer gap
  since the previous collection is covered too, so no period is ever skipped.
  How often it runs, and how far back it goes, are both up to you on the
  "Automatic E-Fatura Synchronization" scheduled action. Turning the option on
  asks for the user the synchronization signs in to the Tax Authority as, whose
  credentials must be the ones of the company's VAT number.
- The synchronization requires the Portal das Finanças credentials of the VAT
  number of the company, set on the Tax Authority section of your user
  preferences: either the credentials of the company itself or those of one of
  its sub-users, in the "NIF/user" form. The Tax Authority only returns the
  documents of the VAT number that signs in, so credentials of a different VAT
  number are refused, and the refusal now tells you which VAT number is expected
  and which one is signing in.
- Synchronized documents now show the ATCUD printed on the document, the
  activity sector the Tax Authority reports, and whether the vendor issued them
  under the cash VAT scheme.
- Documents issued by you on behalf of the vendor, under a self-billing
  agreement, are now flagged as such, linked to the document already issued in
  the system, and no longer ask for a tax mapping or create a second vendor
  bill.
- Receipts and the remaining document types the Tax Authority reports which are
  not purchase documents are no longer collected.
- The journal chosen when importing E-Fatura documents, or when creating the
  vendor bills from the E-Fatura list, is now the journal those bills are
  created on. Until now it was ignored and the bills went to whichever purchase
  journal came first.
- The state the E-Fatura portal shows for each document (Pending, Registered,
  Cancelled) is only given to the issuer of the document, never to its
  customer. Documents collected by the synchronization are therefore recorded
  as Registered. A state collected earlier from the E-Fatura file is kept as it
  stands, since that one is the real state: to know the state of a document,
  import the E-Fatura file, which still carries it.

5.7.0 (2026-08-19)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- A contact created automatically by the E-Fatura process (import or QR code
  scan) is now marked with the new "Created by E-Fatura" checkbox, in the
  E-Fatura section of the contact form, so the contacts whose data still has to
  be reviewed and completed can be told apart. The checkbox cannot be changed
  by hand.

5.6.0 (2026-08-18)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- New E-Fatura tax mapping table, replacing the four default tax fields and the
  default product of the Accounting settings and of the vendor form. Besides the
  tax rate, a mapping can now be matched on the tax genre, rate type, exemption
  reason, country, region and rate item reported by the synchronization, and it
  can be narrowed to specific vendors.
- The product to use on the vendor bill lines is now part of the mapping, so
  different rates and vendors can use different products.
- The synchronization stores the full tax detail of every e-fatura line
  (tipoTaxaIva, taxa, motivoIsencao, paisTaxa, regiaoTaxa and taxaIvaVerba), so
  the mapping is resolved with the values actually reported by the AT.
- Portuguese companies get four default mappings when the chart of accounts is
  loaded: 23%, 13%, 6% and 0% (M99) mainland VAT purchases, on the generic
  Expenses product.
- The default mappings only pin the criteria the AT actually discriminates on:
  the rate type and the rate item merely repeat the rate, and the genre and the
  exemption reason are dropped at 0%, where the AT reports lines as IS, NS and
  IVA indifferently and every 0% tax books the same. The genre is kept on the
  rated mappings so a stamp duty line never deducts VAT that was never charged.
- The rate of an E-Fatura tax mapping can be left empty to match any of them, so
  a single generic mapping can cover a whole tax genre. It accepts any numeric
  format: 23, 23.0 and 23,00 all match a rate of 23% reported by the AT.
- A mapping can now list several vendors instead of one.
- The order of the table is what decides which of the matching mappings applies:
  the first one from the top wins. Being set for a vendor no longer overrides
  that order, it only places the mapping above the generic ones to start with,
  and dragging it below one of them makes the generic one apply.
- The tax genre only offers the three the AT reports: VAT, Stamp Duty and Non
  Applicable.
- A new tax created from a mapping is a purchase tax.
- Credit notes fall back to the expense refund account of the company, and then
  to the expense account, instead of refusing to create the vendor bill when
  neither the product nor its category defines a refund account.
- The product and the tax of a mapping are optional, and the vendor bill line is
  created without them: it takes the whole amount reported by the AT so the bill
  still adds up to the E-Fatura total.
- A document whose reported taxes aren't all mapped is no longer turned into a
  vendor bill: a partial bill would carry a total that doesn't match the
  E-Fatura one while reading as complete. The document is flagged instead, with
  a warning banner naming the taxes that are missing a mapping, a warning sign
  on the lines concerned, a list decoration, a 'Missing Tax Mapping' filter and
  a count in the import wizard, which links straight to the documents and to
  the mapping table.
- Create/Update Invoices now reports the documents whose taxes aren't all
  mapped instead of skipping them, with a button that opens the mapping table:
  the bills were asked for explicitly there, so nothing is left half done.
- New button on each e-fatura line that opens a tax mapping prefilled with the
  criteria the AT reported for it, so only the tax has to be chosen.

**Bugfixes**

- The taxes of a vendor bill are compared against every tax the AT reported for
  the document, not only VAT: the AT sends VAT alone in the document total and
  stamp duty on the lines, so a bill carrying mapped stamp duty was reported as
  diverging from the E-Fatura.
- Creating a mapping clears the missing mapping warning of the documents it
  covers right away, instead of only after a reload.
- Updating a database whose old E-Fatura default product or tax belonged to
  another company no longer interrupts the update. The E-Fatura tax mapping
  created out of that configuration is left without a product, and a tax of
  another company is left out of the table.

5.5.1 (2026-07-31)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Scanning the QR code of a document issued to another company no longer fills
  in the vendor bill: the vendor, the reference and the E-Fatura record are left
  untouched, only the warning is shown.

5.5.0 (2026-07-24)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Add a manual "Scan QR" button to the expense form (same behaviour as the
  vendor bill one), so receipts attached after the expense is created can
  also be scanned. The scan now looks at every attachment of the expense,
  not only the main one.

5.4.0 (2026-07-23)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Rework the QR code detection of vendor bill attachments: decode the images
  embedded in PDFs at native resolution before falling back to page renders,
  enhance low-quality scans (thermal receipts, photos), only pick the fiscal
  QR code when a document carries several, and switch the decoder from
  pyzbar/zbar to OpenCV WeChatQRCode (no OS-level dependency required).
- Scan the Portuguese QR code of expense receipts too (Expenses upload):
  fill the expense total amount, date, vendor and description from the QR
  code data. New dependency on ptplus_expense.
- The opencv-contrib-python-headless python package is an optional
  dependency: when it is not installed the QR code scan is skipped with a
  log warning, uploads and upgrades are never blocked.

5.1.0 (2023-11-16)
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
