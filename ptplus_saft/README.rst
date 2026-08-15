=============================
Portugal - SAF-T PT Statement
=============================

Generate and export the portuguese version of the v1.04 SAF-T file
(Standard Audit File for Tax purposes).

**Table of contents**

.. contents::
   :local:

Installation
============

Install the module with required dependencies:

* pip install unicodecsv
* add the module to an addons folder, restart Odoo, update the addons list and activate
  it.

Usage
=====

Available soon.

Known issues / Roadmap
======================



Changelog
=========

4.4.0 (2026-08-14)
~~~~~~~~~~~~~~~~~~

**Improvement**

- The SAF-T import now says up front what it can take from the file you
  uploaded. There are three kinds of SAF-T and they do not all carry the same
  data: an accounting file has the chart of accounts and the journal entries, an
  invoicing file has neither, and an integrated file has both plus the invoices.
  Until now an invoicing file imported only its customers and suppliers with no
  explanation, which looked as though records had gone missing. A note at the
  top of the import now states which kind of file it is and what will be
  imported from it.

4.3.1 (2026-07-31)
~~~~~~~~~~~~~~~~~~

**Bugfixes**

- In a company set up as a branch of another one, issuing any document
  (quotation, invoice, receipt) failed with a SAF-T validation error about the
  customer's account. The account code was being looked for on the branch, when
  it belongs to the parent company that owns the chart of accounts. The
  customer and supplier accounts were missing from the exported SAF-T file for
  the same reason, and are now filled in.
- Documents of companies that do not use Portuguese Invoicing are no longer
  prepared for the SAF-T. In a database shared with foreign companies (for
  instance a Spanish company alongside the Portuguese one), confirming a journal
  entry in the foreign company failed with a SAF-T validation error and could
  not be posted at all. Only the Portuguese company and its branches are
  reported now.
- Products that were modified after being sold no longer generate a duplicate
  product snapshot every time a new document is issued: the latest snapshot
  is now reused, keeping the products reported in the SAF-T file free of
  repeated entries.

4.3.0 (2026-07-29)
~~~~~~~~~~~~~~~~~~

**Improvement**

- Import: accumulate record-creation errors instead of aborting at the first
  one. Each staged line now runs in its own savepoint; failures are recorded
  on the line (new "Error" status with the error message), the run carries on
  and finishes with a summary and an "Errors" smart button listing every
  failed record. Re-clicking "Create/Update Records" retries only the failed
  lines once the causes are fixed.
- Import: resolve each move's journal, partner, account and move lines
  through a lookup built once per run instead of re-scanning every staged
  line for every single move/move line (quadratic), which made the record
  creation of a large import take hours.
- Import: create records in batches of 500 (moves together with their lines,
  chatter subscription/tracking disabled) instead of one at a time, falling
  back to record-by-record only for a batch that fails so errors still land
  on their exact line.
- Import: "Process File" is now only offered on a fresh configuration; once
  processed, a new "Reset" button (with confirmation) clears the staged lines
  in the background and returns the configuration to its initial state so a
  new SAF-T file can be processed. Records already created are not touched.
- Import: the progress note, status bar and buttons now update live on the
  open form (websocket push on every batch commit), without refreshing the
  page.
- Import: selecting failed lines in the staged-lines list offers a "Retry"
  button that resets and re-queues only those lines.
- Import: resolve a journal entry's partner even when its SAF-T id is staged
  more than once (an entity listed as both customer and supplier) or its
  line was auto-ignored as "no differences" — as long as everything points
  at the same partner.
- Import: show live "x/total" progress in every processing phase — partners/
  accounts/products staging, journal-entries staging (transactions counted
  against the file's ``NumberOfEntries``), cleanup countdown and record
  creation — published through a separate cursor so it is visible while the
  work is still running.
- Import: stream the GeneralLedgerEntries with lxml's C parser instead of
  xmlschema's pure-Python lazy decoding, resume by transaction (not by
  journal) and commit every 500 transactions. Decoding+validating a single
  big journal (e.g. 75k transactions in a 217MB file) burned more CPU than
  the worker limits allow before anything was committed, so the cron was
  killed and restarted from scratch forever — the import looked stuck while
  burning CPU in a loop. Structural issues inside a transaction now surface
  as per-line errors at record creation instead of blocking the import
  upfront (Header/MasterFiles keep the XSD validation).

4.2.3 (2026-07-29)
~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Import: merge repeated MasterFiles account entries (invalid but seen in
  real-world SAF-T files) instead of failing halfway through record creation
  on the account code-uniqueness constraint; repeated entries with conflicting
  descriptions are now rejected upfront with a clear error.

4.2.2 (2026-07-23)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Recompute the payment SAF-T element when the payment is (un)reconciled: on
  real-time companies the element was computed at issuing, before the register
  payment wizard reconciles it with the invoice, and stayed cached empty — the
  payment then silently disappeared from the SAF-T Payments section until a
  manual "Recompute elements" export.

4.2.1 (2026-07-22)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Clear the previous run's staged lines inside the background job (a new
  batched "cleanup" stage with periodic commits) instead of synchronously in
  the "Process File" click, which timed out the HTTP worker when the previous
  import had staged hundreds of thousands of lines.
- Don't stage the MasterFiles twice when the first staging chunk is
  interrupted before completing its first journal.
- Index ``configuration_id`` and ``saft_import_move_id`` on the staging model:
  without them every staged-line delete seq-scanned the whole table for the
  restrict-FK check, making cleanup of a large import extremely slow.

4.2.0 (2026-07-21)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Accept SAF-T files uploaded as a ``.zip`` archive (as commonly distributed in
  Portugal for large files), in addition to raw ``.xml``. The archive's XML
  entry is extracted before validation/parsing.
- Process the SAF-T import in the background instead of inline in the HTTP
  request. Clicking "Process File" or "Create/Update Records" now queues the
  work to a cron job (``ir_cron_process_saft_import``) and returns
  immediately; a progress note on the form ("Progress") shows whether the
  import is still running or finished. This avoids Odoo worker time/memory
  limits killing large imports mid-way and taking down the database.
- Parse ``GeneralLedgerEntries``/``Journal``/``Transaction`` data in a
  streaming fashion (``xmlschema`` lazy resource) instead of decoding the
  whole SAF-T file into memory at once, and commit to the database every 500
  records instead of holding the entire import in a single transaction. This
  is what actually allows large files (e.g. 25MB+) to be imported without
  running out of memory or losing all progress on a worker restart.
- Import partner VAT numbers exactly as they appear in the SAF-T source,
  without re-running Odoo's offline NIF checksum (``no_vat_validation``), so
  the foreign/legacy/malformed VAT numbers real AT exports contain no longer
  abort the import.
- Report structural XSD violations (wrong types, lengths, missing required
  elements) with a readable message listing the offending nodes (path and
  reason) instead of a raw ``xmlschema`` traceback, so the source file can be
  corrected. XSD 1.1 ``<xs:assert>`` violations (e.g. a GM account without a
  ``TaxonomyCode``) are only logged as warnings and no longer block the import:
  they are not enforced by the AT on export, so files that are valid in
  practice are now accepted.
- Show record-creation progress as ``x/Y`` (done/total) on the configuration,
  so it is clear how much of the import is left.
- Add a list view to the SAF-T import configurations (kanban stays the default)
  to make it easier to select and delete several at once.

**Bugfixes**

- The "Process File" button no longer stays visible once a configuration has
  reached the "Done" state (the ``done`` state was previously never reached).
- Actually import journal entries: the streaming lazy resource used depth 1
  while ``GeneralLedgerEntries/Journal`` sits at depth 2, so no journal (and
  therefore no ``account.move``) was ever imported.
- No longer crash staging a PT partner without a NIF (e.g. "Consumidor
  Final"), which legally carries none.
- Fix ``account.move`` creation from journal entries: write ``partner_id``
  (the previously written ``partner_code`` field does not exist on
  ``account.move``), resolve the partner by ``CustomerID`` or ``SupplierID``,
  and allow GL transactions with no counterparty to be imported without a
  partner.
- Decode the ``Header`` and ``MasterFiles`` from a sliced "head" document
  (``GeneralLedgerEntries``/``SourceDocuments`` are optional in the schema)
  instead of parsing the whole file, so a large (e.g. 250MB) SAF-T no longer
  runs out of memory building the full XML tree just to read the top of it.
- Resume the chunked import immediately between chunks: the cron progress is
  now reported so Odoo re-runs the job at once while work remains, instead of
  treating each chunk as "finished" and waiting for the hourly fallback (which
  made a large import appear stuck for a long time between chunks).
- Compute the smart-button counts with a single SQL aggregation instead of
  loading every staged line, so opening a configuration or returning to the
  kanban stays fast even after a large import.

4.1.8 (2026-07-14)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Remove the legacy "Extraction" SAF-T computing method; companies still
  using it are migrated to "Real-time".

**Bugfixes**

- Include the GeneralLedgerEntries section in the Accounting and Integrated
  files, placed before SourceDocuments as the schema requires.
- Don't drop the Customer/Supplier/Product master files when the file has no
  TaxTable (e.g. Accounting exports).
- Read the branches' journal entries when exporting from the root company.
- Declare stamp-duty charge lines (product configured as stamp duty) with
  the line's NS tax and exemption M99.

4.1.7 (2026-07-01)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Adding a VAT to a customer that had none now updates the SAF-T of invoices
  already issued to that customer as "consumidor final".

**Bugfixes**

- Include the accounting data of company branches and sub-branches in the
  Accounting SAF-T. The G/L accounts (opening/period balances), G/L entries and
  balance warnings now cover the export company and its whole ``child_of`` tree
  (the report is filed per taxpayer at the root company) instead of only the
  selected company, for both the extraction and real-time extraction methods.
- Resolve the ``AccountID`` of branch journal lines in the real-time SAF-T
  element via the root company's account codes. Previously the code was read
  under the branch company (which has no ``code_store`` entry), producing an
  empty ``AccountID`` that raised an encoding error and blocked branch moves
  from being posted.

4.1.6 (2026-06-29)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Restrict the imported-SAF-T-elements smart button (both the ``import_saft_id``
  field and the button) on the invoice, partner, account, journal and product
  forms to the accounting Billing group. Previously the
  ``import_saft_id`` field was computed for every user opening those forms,
  raising an access error for users without read access on
  ``l10n_pt.account.saft.import`` (e.g. salespeople).

4.1.5 (2026-06-24)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- Report the line ``UnitPrice`` and ``SettlementAmount`` in the company
  (reporting) currency for invoices issued in a foreign currency. ``UnitPrice``
  was previously emitted in the document currency and the discount was
  converted with the exchange rate inverted.
- Report the SAF-T line ``References`` (origin document and correction reason)
  on corrective documents, so credit and debit notes can point at the document
  they correct.

4.1.4 (2026-06-16)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Added a 'Blocked' SAF-T element status that freezes the element and is never
  recomputed. It is set/cleared manually from the invoices and payments list
  ``Action`` menu, and is released only when the document is cancelled.
- Exposed the SAF-T element status as an optional column on the invoices and
  payments lists.
- Added a list action to recompute the SAF-T element on the spot, without
  extracting the SAF-T file.

4.1.3 (2026-01-15)
~~~~~~~~~~~~~~~~~~~

**Improvements**

- Fixed inconsistencies between 'extraction' and 'realtime' SAF-T calculation methods.
- Fixed inconsistencies between ECO taxes in invoices and sale orders.

4.1.2 (2025-11-11)
~~~~~~~~~~~~~~~~~~~
**Features**

- Added special taxes artificial line (IEC/ECO taxes) on Sales Invoices.
- Added artificial Downpayment product, and add it to downpayment invoice and sale order lines (SalesInvoice and WorkDocument).


4.0.1 (2024-01-29)
~~~~~~~~~~~~~~~~~~~

**Features**

- Added a new method to obtain SAF-T using dataport log without using the user interface
  This can be useful for SAF-T extraction automation

4.0.0 (2023-11-16)
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
