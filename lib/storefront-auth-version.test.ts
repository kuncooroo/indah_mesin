import assert from "node:assert/strict";
import test from "node:test";

import {
  isCurrentAuthVersion,
  isEmailChange,
  planGoogleLink,
} from "./storefront-auth-version";

test("first Google sign-in creates an account", () => {
  assert.deepEqual(
    planGoogleLink({
      googleSub: "google-1",
      matchByGoogleSub: null,
      matchByEmail: null,
    }),
    { kind: "create" }
  );
});

test("Google sign-in adopts an unverified password account and revokes its sessions", () => {
  assert.deepEqual(
    planGoogleLink({
      googleSub: "google-victim",
      matchByGoogleSub: null,
      matchByEmail: { id: "user-1", googleSub: null },
    }),
    { kind: "refresh", userId: "user-1", revokeOtherSessions: true }
  );
});

test("the same Google account can sign in again without revoking the new session", () => {
  assert.deepEqual(
    planGoogleLink({
      googleSub: "google-1",
      matchByGoogleSub: { id: "user-1" },
      matchByEmail: { id: "user-1", googleSub: "google-1" },
    }),
    { kind: "refresh", userId: "user-1", revokeOtherSessions: false }
  );
});

test("a second Google identity cannot take over an already linked mailbox", () => {
  assert.deepEqual(
    planGoogleLink({
      googleSub: "google-attacker",
      matchByGoogleSub: null,
      matchByEmail: { id: "user-1", googleSub: "google-owner" },
    }),
    { kind: "deny" }
  );
});

test("JWTs minted before authVersion existed stay valid at version 0", () => {
  assert.equal(isCurrentAuthVersion(undefined, 0), true);
  assert.equal(isCurrentAuthVersion(0, 0), true);
});

test("a password reset bumps the version and drops the pre-registered session", () => {
  assert.equal(isCurrentAuthVersion(undefined, 1), false);
  assert.equal(isCurrentAuthVersion(0, 1), false);
  assert.equal(isCurrentAuthVersion(1, 1), true);
});

test("profile email updates are detected case-insensitively", () => {
  assert.equal(isEmailChange("owner@company.com", "owner@company.com"), false);
  assert.equal(isEmailChange("Owner@company.com", "owner@company.com"), false);
  assert.equal(isEmailChange("owner@company.com", "attacker@evil.com"), true);
});
