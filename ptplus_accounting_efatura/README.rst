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

5.11.1 (2026-09-09)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Dragging a row of the E-Fatura tax mapping table to reorder it is no longer
  slow, however many mappings and documents the company has. Every change to
  the table used to recheck the tax mapping of all the company's e-fatura
  documents, and reordering does not change which of them are missing one, so
  on a company with a few thousand documents the reorder took minutes and lost
  the connection. Editing, adding or removing a mapping still rechecks them,
  because there the answer can change.
- That recheck is itself much faster now: the mapping table is read once for
  the whole company instead of once per e-fatura line. Editing a mapping on a
  company with thousands of documents took over ten seconds and is now
  immediate, and the same gain applies to importing and synchronizing.

5.11.0 (2026-09-09)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- The summary shown at the end of an e-Fatura import or synchronization now
  reports the documents that matched a vendor bill already posted. Those
  documents counted as neither created nor updated, so an import that brought
  in forty-six documents and created three bills read as "0 updated", with no
  sign of what had become of the other forty-three.

5.10.1 (2026-09-04)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Reading the QR code of an invoice of several pages no longer runs out of time
  on a document it is perfectly able to read. The pages of an invoice repeat
  the same letterhead or background image, and each repetition was being read
  again from scratch: a six-page telecommunications invoice spent all the time
  it was given on those repeats and came back as not read in time. The same
  invoice is now read in three seconds.
- The time a document is given before the search is cut off went from twelve to
  forty-five seconds, so a genuinely heavy document is read instead of being
  handed back to you.

5.10.0 (2026-09-02)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Merging the duplicate vendor bill of an E-Fatura document now opens a window
  that says what is about to happen before anything is done, instead of acting
  on the spot.
- The bill that stays is no longer rewritten. Until now it was reset to draft,
  took a new number from the journal and had its date, its vendor and its
  reference replaced with the ones of the other bill. Now the E-Fatura document
  is simply pointed at it, and everything on it (number, dates, amounts, lines)
  is left as it stands, posted bills included.
- The vendor document is kept: the attachments of the duplicate are copied to
  the bill that stays before the duplicate goes.
- A duplicate still in draft is deleted, as before. A posted one is now
  cancelled instead of being reset to draft and deleted, which used to undo the
  reconciliations it was part of. A cancelled one is left as it is, and a
  cancelled bill is never the one that stays.
- The window shows what the Tax Authority reported for the document (vendor,
  date, total, taxes and state) above the two bills, and marks in orange the
  date, the total and the taxes of each bill that disagree with it, so it is
  plain which of the two matches the E-Fatura.
- The window lists what deserves a second look without stopping you: the two
  bills disagreeing on the date, the total, the taxes or the currency, saying
  which of them matches the E-Fatura document; both bills being posted; the
  bill that stays already carrying assets or deferral entries built from amounts
  the Tax Authority contradicts; and the two bills being on different vendors.
- The merge now refuses the cases where it would have to decide on its own what
  to do with accounting already produced: a duplicate with payments matched to
  it, one that originated an asset, or one that generated deferral entries.
  Undo those first, or keep that bill instead, which the window lets you do
  with one button.
- On the vendor bill, the Odoo banner that spots a duplicate now offers "Merge
  E-Fatura" where a merge is possible.
- Two bills of different companies can no longer be merged.
- The help of the "E-Fatura Taxes" field now says what it shows: every tax the
  Tax Authority reported, VAT and stamp duty included.

5.9.1 (2026-09-02)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- On a database with several companies, an E-Fatura document is no longer
  matched against the vendor bills of another company. Companies of the same
  group share their vendors and see each other's documents, so a document
  could take the bill of whichever company had issued one with the same
  reference first, and the synchronization stopped with an error instead of
  creating the bill. The same goes for the document a QR code scan or an
  import looks for: each company only finds its own.

5.9.0 (2026-09-02)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Choosing the product on a line of a vendor bill built from the E-Fatura no
  longer changes its amount or its taxes. Those are the ones the Tax Authority
  reported for the document, and until now picking a product replaced them with
  the price and the taxes of that product, leaving a bill that no longer added
  up to the E-Fatura.

5.8.2 (2026-09-02)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- The "Scan QR" button of a vendor bill and of an expense now gives the reason
  when it reads nothing. A server without the QR code reader installed says so,
  instead of reporting the document as having no QR code, and the message tells
  you to ask your support team to install the reader.
- Reading a document of several pages no longer takes minutes. Looking for a
  QR code on a page that has none is what costs the time, so the search now
  starts with the first and the last page, which is where the QR code of an
  invoice is, and stops once it has spent the time it is given. A document
  whose QR code is a picture, as invoices issued by software normally are,
  keeps being read as fast as before, however many pages it has.
- A document the search did not get through in time now says so, instead of
  being reported as having no QR code. Until now the scan waited twenty
  seconds and then went on in silence, and a long document whose QR code was
  on a late page was reported as having none.

5.8.1 (2026-08-24)
~~~~~~~~~~~~~~~~~~

**Bugfixes**

- In the E-Fatura list, a document with no vendor bill is now greyed out instead
  of shown in green. Green only meant that no problem had been detected, so a
  document still waiting for its vendor bill looked as settled as a fully
  processed one.

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
