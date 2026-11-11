import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { poTaxIdsFromNotes } from "./po-document-snapshot.ts";

describe("poTaxIdsFromNotes", () => {
  const submitted = JSON.stringify({
    requestId: "6c1d1c3e-4b2a-4f0a-9c1e-2a6b8d0e1f11",
    voltage: "380V",
    companyName: "PT Alpha",
    npwpNumber: "01.234.567.8-901.000",
    nibNumber: "1234567890123",
  });

  it("keeps the NPWP and NIB from the order snapshot after the company profile changes", () => {
    const ids = poTaxIdsFromNotes(submitted, {
      npwpNumber: "99.999.999.9-999.000",
      nibNumber: "9999999999999",
    });
    assert.equal(ids.npwpNumber, "01.234.567.8-901.000");
    assert.equal(ids.nibNumber, "1234567890123");
  });

  it("uses the current company tax IDs when the order has no snapshot", () => {
    const ids = poTaxIdsFromNotes("Catatan admin", {
      npwpNumber: "01.234.567.8-901.000",
      nibNumber: "1234567890123",
    });
    assert.equal(ids.npwpNumber, "01.234.567.8-901.000");
    assert.equal(ids.nibNumber, "1234567890123");
  });

  it("ignores blank snapshot fields and falls back to the current company", () => {
    const ids = poTaxIdsFromNotes(JSON.stringify({ npwpNumber: "  ", nibNumber: "" }), {
      npwpNumber: "01.234.567.8-901.000",
      nibNumber: null,
    });
    assert.equal(ids.npwpNumber, "01.234.567.8-901.000");
    assert.equal(ids.nibNumber, "");
  });
});
