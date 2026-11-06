import assert from "node:assert/strict";
import test from "node:test";

import { mergeOrderNotes, orderNoteForEditor, parsePoSnapshot } from "./order-notes";

const snapshot = JSON.stringify({
  requestId: "6d1c0c3e-1b2a-4f0e-9c1a-0a0b0c0d0e0f",
  voltage: "380V / 50Hz",
  buyerName: "Sari",
  companyName: "CV Maju",
});

test("parsePoSnapshot recognizes a storefront PO blob", () => {
  const parsed = parsePoSnapshot(snapshot);
  assert.equal(parsed?.voltage, "380V / 50Hz");
  assert.equal(parsePoSnapshot("Approved, start production"), null);
  assert.equal(parsePoSnapshot(null), null);
});

test("a plain admin note does not drop the ordered voltage", () => {
  const merged = mergeOrderNotes(snapshot, "Approved, start production");
  const parsed = parsePoSnapshot(merged);
  assert.equal(parsed?.voltage, "380V / 50Hz");
  assert.equal(parsed?.requestId, "6d1c0c3e-1b2a-4f0e-9c1a-0a0b0c0d0e0f");
  assert.equal(parsed?.buyerName, "Sari");
  assert.equal(parsed?.adminNote, "Approved, start production");
});

test("clearing the catatan keeps the snapshot", () => {
  const withNote = mergeOrderNotes(snapshot, "call the buyer");
  const cleared = mergeOrderNotes(withNote, "   ");
  const parsed = parsePoSnapshot(cleared);
  assert.equal(parsed?.voltage, "380V / 50Hz");
  assert.equal(parsed?.adminNote, undefined);
});

test("resubmitting the raw snapshot leaves it unchanged", () => {
  assert.equal(mergeOrderNotes(snapshot, snapshot), snapshot);
});

test("an edited snapshot JSON is accepted", () => {
  const edited = JSON.stringify({ ...JSON.parse(snapshot), voltage: "220V" });
  assert.equal(mergeOrderNotes(snapshot, edited), edited);
});

test("plain notes without a snapshot still save as text", () => {
  assert.equal(mergeOrderNotes("old note", "new note"), "new note");
  assert.equal(mergeOrderNotes(null, "  "), null);
});

test("the editor shows only the human note", () => {
  assert.equal(orderNoteForEditor(snapshot), "");
  const withNote = mergeOrderNotes(snapshot, "Approved");
  assert.equal(orderNoteForEditor(withNote), "Approved");
  assert.equal(orderNoteForEditor("plain"), "plain");
});
