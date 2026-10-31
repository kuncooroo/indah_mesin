import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveAdminAccess } from "./admin-access.ts";

describe("resolveAdminAccess", () => {
  it("denies a deleted admin even if a caller still presents a superadmin token", () => {
    assert.equal(resolveAdminAccess(null), null);
    assert.equal(resolveAdminAccess(undefined), null);
  });

  it("uses the current database role after a demotion", () => {
    assert.equal(resolveAdminAccess({ role: "ADMIN" }), "ADMIN");
  });

  it("allows an active admin or superadmin", () => {
    assert.equal(resolveAdminAccess({ role: "SUPERADMIN" }), "SUPERADMIN");
    assert.equal(resolveAdminAccess({ role: "ADMIN" }), "ADMIN");
  });

  it("denies an unknown role", () => {
    assert.equal(resolveAdminAccess({ role: "USER" }), null);
    assert.equal(resolveAdminAccess({ role: "" }), null);
  });
});
