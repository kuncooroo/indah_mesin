import assert from "node:assert/strict";
import test from "node:test";

import { decidePoResubmit, readPoNotes } from "./po-resubmit";

const incoming = {
  productId: "prod-1",
  quantity: 4,
  voltage: "220V",
};

test("identical open PO is a replay", () => {
  assert.equal(
    decidePoResubmit(
      {
        status: "SUBMITTED_VIA_WA",
        productId: "prod-1",
        quantity: 4,
        voltage: "220V",
        notesAreSnapshot: true,
      },
      incoming,
    ),
    "replay",
  );
});

test("changed quantity on an open quotation is revised in place", () => {
  assert.equal(
    decidePoResubmit(
      {
        status: "SUBMITTED_VIA_WA",
        productId: "prod-1",
        quantity: 1,
        voltage: "380V / 3 Phase",
        notesAreSnapshot: true,
      },
      incoming,
    ),
    "revise",
  );
});

test("changed product or voltage on a draft is revised", () => {
  assert.equal(
    decidePoResubmit(
      {
        status: "DRAFT",
        productId: "prod-2",
        quantity: 4,
        voltage: "220V",
        notesAreSnapshot: true,
      },
      incoming,
    ),
    "revise",
  );
});

test("processed orders are not overwritten when the payload changes", () => {
  for (const status of ["NEGOTIATING", "APPROVED", "CANCELLED"]) {
    assert.equal(
      decidePoResubmit(
        {
          status,
          productId: "prod-1",
          quantity: 1,
          voltage: "220V",
          notesAreSnapshot: true,
        },
        incoming,
      ),
      "reject",
    );
  }
});

test("admin free-text notes are not treated as a revisable snapshot", () => {
  assert.equal(
    decidePoResubmit(
      {
        status: "SUBMITTED_VIA_WA",
        productId: "prod-1",
        quantity: 1,
        voltage: null,
        notesAreSnapshot: false,
      },
      incoming,
    ),
    "reject",
  );
});

test("readPoNotes keeps quotation JSON and rejects free text", () => {
  assert.deepEqual(
    readPoNotes(JSON.stringify({ requestId: "abc", voltage: "220V" })),
    { voltage: "220V", notesAreSnapshot: true },
  );
  assert.deepEqual(readPoNotes(null), { voltage: null, notesAreSnapshot: true });
  assert.deepEqual(readPoNotes("Hubungi buyer besok"), {
    voltage: null,
    notesAreSnapshot: false,
  });
});
