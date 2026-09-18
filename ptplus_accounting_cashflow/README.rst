======================
Portugal - Cash Flow
======================

Classify the day-to-day cash movements and produce the IES cash flow statement.

* Classify bank and cash journal items over the official cash flow categories,
  splitting a single movement over several categories with exact amounts; a
  distribution below the movement amount is allowed and stays flagged as
  still to classify, but can never exceed the movement
* Automatic classification of payments, bank transactions and journal entries
  from the distribution models, with no field to fill in when registering a
  payment or reconciling; the manual classification happens in one place,
  the Classify Cash Flows list, and on the journal entry items
* Distribution models (partner, product, account, optionally per direction)
  that classify the bank transactions automatically on reconciliation, from
  the lines of the settled documents, each document weighed by the amount
  actually reconciled with it, and classify entries posted directly against
  mapped accounts (bank fees, taxes, loans)
* Transfers between bank and cash accounts (cash deposits and withdrawals,
  transfers between bank accounts) classified automatically as internal
  transfers on both sides of the movement, right away, whether booked in a
  single entry or as two transactions linked by the company's internal
  transfer account, so they never show up as movements to classify
* A default set of distribution rules per chart of accounts (SNC Base and
  SNC Microentidades), validated by the accounting department; user-created
  rules take precedence and the defaults can be edited or archived
* Non-blocking warnings and a dedicated filter for movements still to classify;
  the statement lists the movements of the period still missing classification
* The Classify Cash Flows list (Accounting / Review / Control), the single
  place for manual classification: every bank/cash movement, the ones still
  to classify first, with filters by state and date, grouping (by category
  included, a split movement showing up under each of its categories), the
  distribution editable on the row for one or several selected movements at
  once, the models suggestion shown next to it and accepted with one click,
  per movement or for a whole selection or filter, the reconciled documents
  at hand, and a detail of the selected movements: their document lines
  grouped by movement, each with the category the movement carries next to
  the proposed one, accepted with one click and highlighted when chosen by
  hand
* Cash Flow Statement report with the quadros Q04-B (Demonstração dos Fluxos de
  Caixa) and Q0701 (Informação adicional) of the IES Anexo A, exportable to PDF
  and XLSX, with a consistency control against the measured bank/cash balances

**Table of contents**

.. contents::
   :local:

Installation
============

Add the module to an addons folder, restart Odoo, update the addons list and activate
it.

Configuration
=============

The classification screens are visible to the users of the "Cash Flow
Classification" group. Users of the accounting "Basic" group (community: part
of the full accounting features; enterprise: the "Invoicing & Banks" access
level) get it by default; any other user can be granted the group manually on
the user form. Note that in the community edition the accounting
Administrator level does not include "Basic", so those users also need the
manual assignment unless they have the full accounting features.

Usage
=====

The classification runs by itself as soon as the module is installed: when a
payment is registered, a bank transaction reconciled or an entry posted
against a mapped account, the distribution models classify the bank/cash
movement, with nothing to fill in on the payment or on the reconciliation.
What the models cannot classify shows up in the Classify Cash Flows list
(below) and is flagged on the journal entry, where the distribution can also
be edited on the items, the way the analytic distribution is. Movements
covering more than one nature can be split with exact amounts (e.g. a single
5.000€ payment split between suppliers, fixed assets and loan repayments); the
distribution may stay below the movement amount (the movement is then still
flagged to classify) but can never exceed it.

Movements between cash and cash equivalents are not cash flows: transfers
between bank and cash accounts (cash deposits and withdrawals, transfers
between bank accounts) are classified automatically as internal transfers on
both sides, right away, whether booked in a single entry or as a bank
transaction and a cash transaction linked by the company's internal transfer
account. The default rule on the bank and cash accounts (classes 11 and 12)
takes care of it, so these movements never wait to be classified, and the
statement checks that the internal transfers of the period net to zero.

Each category feeds its quadro Q04-B field and, when applicable, its quadro
Q0701 field with the same amount — the additional information of Q0701 is
about the same money. When a movement needs different amounts per quadro
(e.g. only part of a post-employment contribution belongs to "Pagamentos ao
pessoal" while the whole of it must be disclosed in Q0701), split the
movement over categories sharing the same Q0701 field but with different
Q04-B fields — new categories with the right mapping can be created in the
configuration. Differences that never touched the bank account (e.g. Q0701
dividends, which the official instructions require gross of withholding
while the statement of cash flows carries the net amount actually received)
are corrected directly on the Q0701 lines of the statement before exporting:
those lines are editable in the analysis screen.

Manual classification is done in Accounting / Review / Control / Classify
Cash Flows, the list of every bank/cash movement, opened on the ones still
to classify. The list can be searched, filtered (to classify, classified,
internal transfers; today, this week, any period) and grouped (journal,
partner, categories, account, month; a movement split over several
categories shows up under each of them). The distribution is edited directly
on the row; several selected movements can be edited at once with a single
category, each one then taking its own amount in it. When the distribution
models map the documents behind a movement still to classify, their
suggestion is shown in its own column, and the arrow between it and the
distribution moves it there, row by row or with the Accept Suggestions
button for the selected movements (for every movement matching the filters
when nothing is selected); the notification that follows offers to undo
while it shows. The documents behind each movement (the ones it is
reconciled with, or its own journal entry when it was booked directly
against an account) are listed on the row and can be opened from it.

Classify In Detail opens the document lines behind the selected movements
(the lines of the documents they settle, or their direct counterparts),
grouped by movement, classified or not. Each line shows, as on the list, the
category the distribution models propose and the category the movement
actually carries for it, empty while the line is not classified; the
movement header shows the distribution the movement carries and, after an
arrow, the one accepting the pending proposals would give. The arrow of a
line copies its proposal into the category, and the Accept Suggestions
button does it for every selected line still without category (for every
line matching the filters when nothing is selected); the category can also
be chosen by hand. Everything is written on the movement right away: it
receives the per-category sum of its classified lines, so a movement
settling documents of several natures is split without typing amounts. A
category chosen by hand that differs from the proposal is highlighted, and a
filter lists those lines; the notification after accepting offers to undo
while it shows. Movements with nothing behind them (a transaction still on
the suspense account) have no lines here and are classified on the list.
The same detail opens for a single movement from the journal items still to
classify or from the warnings of the statement.

The statement is available under Accounting / Reporting / Portugal /
Financial / Cash Flow Statement: pick the period, analyze, review the warnings
(unclassified movements can be opened and fixed from the wizard) and export to
PDF or XLSX.

Known issues / Roadmap
======================

* The IES Anexo A model produced (Portaria 35/2019, quadros Q04-B/Q0701) only
  takes effect for periods of 2026 and later; earlier periods are filed with
  the Portaria 271/2014 model (quadro 04-C), whose rubrics are equivalent but
  numbered differently. The statement warns about it.

Changelog
=========

5.2.0 (2026-09-18)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- The Classify Cash Flows list no longer slows down as the work advances. On
  a company with a large accounting history, asking for the movements still
  to classify once the period was done, or for the ones already classified,
  could leave the screen loading for a minute or more; both now open
  immediately, whatever the volume and whatever share of the movements is
  already classified.
- Installing the module on a company with years of accounting no longer
  takes hours.

**Bugfixes**

- The Classify Cash Flows list opens much faster on companies with a large
  accounting history: each page of movements is now read in a handful of
  steps instead of one per movement.
- Accepting suggestions now works through a backlog of any size, 2000
  movements at a time, and the notification says how many were classified and
  how many are left, so accepting again carries on where it stopped. Asking
  for everything at once, by selecting all the movements or by opening the
  pending ones of a whole year from the statement, used to leave the screen
  loading until the session gave up. When none of the movements left has a
  suggestion, the notification says that too, instead of inviting a round
  that would classify nothing.
- A movement whose amount is changed after being classified goes back to
  still to classify, on the movement and on its journal entry.
- The list, its filters and the statement now agree on which movements count
  as classified: a distribution off by less than half a cent was accepted in
  one place and reported as missing in another.

5.1.1 (2026-09-17)
~~~~~~~~~~~~~~~~~~~

**Bugfixes**

- The Excel export of the statement now has one sheet per quadro, Q04-B and
  Q0701, each with its own heading and its own rubrics, as the two pages of
  the PDF. Until now the two quadros came out one after the other on a single
  sheet, with nothing separating them.

5.1.0 (2026-09-16)
~~~~~~~~~~~~~~~~~~~

**Improvement**

- Manual classification now happens in one place, the Classify Cash Flows
  list, which replaces the former wizard form: every bank/cash movement is
  there, the ones still to classify first, searchable, filtered by state and
  date (today, this week, any period) and grouped by journal, partner,
  categories (a movement split over several categories is listed under each
  of them), account or month. The distribution is edited directly on the
  row, several selected movements at once if needed (a single category, each
  movement taking its own amount in it). The suggestion of the distribution
  models is shown in its own column and moved to the distribution with the
  arrow of the row, or with the Accept Suggestions button for the selected
  movements (for every movement matching the filters when nothing is
  selected), with an undo offered right after; the reconciled documents are
  listed on the row and can be opened from it. Classify In Detail opens the
  document lines behind the selected movements, grouped by movement, each
  with the proposed category next to the one the movement carries and the
  movement header showing what it carries and what accepting the proposals
  would give: proposals are accepted one by one or all at once, a category
  chosen by hand is highlighted and filterable, everything is written right
  away and an undo is offered after accepting.
- The cash flow fields no longer appear on the payment form, on the Register
  Payment wizard nor on the bank reconciliation: the classification suggested
  by the distribution models is applied automatically, and is reviewed in the
  Classify Cash Flows list or on the journal entry items. The companion
  module for the Enterprise bank reconciliation is removed accordingly.
- Transfers between bank and cash accounts (cash deposits and withdrawals,
  transfers between bank accounts) are now classified automatically as
  internal transfers on both sides of the movement, right away, whether
  booked in a single entry or as a bank transaction and a cash transaction
  linked by the company's internal transfer account. A new default rule on
  the bank and cash accounts (classes 11 and 12) feeds the internal transfers
  category; until now these movements were always left to classify by hand.
- The "View Movements To Classify" button of the statement opens the
  Classify Cash Flows list focused on those movements.

5.0.0 (2026-08-21)
~~~~~~~~~~~~~~~~~~~

**Features**

- Module rewritten for Odoo 19. Cash movements are now classified with a
  distribution over the cash flow categories, with exact amounts, allowing a
  single bank movement to be split over several categories. Classification is
  available on payments, when registering payments, on bank transactions and
  on journal entries, and works out of the box once the module is installed.
  When the payment does not move the bank account directly, the
  classification is done on the bank transaction instead.
- Distribution models by partner, product and account (optionally per
  direction, so one account can map receipts and payments to different
  categories): the document lines are mapped through the models and the
  classification is suggested with the sum of the line totals per category —
  pre-filled when registering a payment, and applied when a bank transaction
  or a direct-to-bank payment is reconciled with the document. On
  reconciliation each document weighs in for the amount actually matched to
  it, so a transaction covering one payment in full and another one only
  partially follows that exact split. Entries posted directly against mapped
  accounts (bank fees, taxes, loan movements) are classified on posting. The
  suggestion behaves as a default, like the analytic models: a value entered
  by the user is never overwritten.
- The module ships a default set of distribution rules per chart of accounts
  (one for SNC Base, one for SNC Microentidades, with the rules common to
  both charts shared), validated by the accounting department; each set only
  applies to companies on its chart. User-created rules take precedence over
  the defaults, and among rules on accounts the most specific account code
  wins; the defaults can be edited or archived.
- New Cash Flow Statement report producing the IES Anexo A quadros Q04-B and
  Q0701, with PDF and XLSX export, drill-down to the classified movements, a
  consistency control against the measured bank/cash balances and an
  accounting control of the class 11/12 account balances against the opening
  and closing fields of the statement.
- Backfill wizard to classify the movements of the past in bulk, pre-filled
  from the distribution models and with the reconciled documents of each
  movement at hand.

Credits
=======

Authors
~~~~~~~

* Exo Software, Lda.

Contributors
~~~~~~~~~~~~

* `Exo Software <https://exosoftware.pt>`_:

  * Pedro Castro Silva
  * João Costa

Maintainers
~~~~~~~~~~~

This module is maintained by Exo Software.

.. image:: https://exosoftware.pt/logo.png
   :alt: Exo Software
   :target: https://exosoftware.pt
