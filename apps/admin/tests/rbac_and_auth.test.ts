import { describe, it } from "node:test";
import assert from "node:assert";
import {
  ROLE_RANK_HIERARCHY,
  canAccessAdmin,
  canAccessEditor,
  hasGranularPermission,
  can,
  canModifyUser,
  requiresDualApproval,
  validateMilitaryPasswordPolicy,
  generateDragonKey,
} from "@dragon/auth";

describe("Dragon Studios Comprehensive RBAC & Security Validation Suite", () => {
  describe("1. Role Hierarchy & Access Boundaries", () => {
    it("should allow staff roles to access admin control plane", () => {
      assert.strictEqual(canAccessAdmin("OWNER"), true);
      assert.strictEqual(canAccessAdmin("FOUNDER"), true);
      assert.strictEqual(canAccessAdmin("CO_FOUNDER"), true);
      assert.strictEqual(canAccessAdmin("ADMIN"), true);
      assert.strictEqual(canAccessAdmin("DEVELOPER"), true);
      assert.strictEqual(canAccessAdmin("SUPPORT"), true);
    });

    it("should strictly deny standard players/users from admin access", () => {
      assert.strictEqual(canAccessAdmin("USER"), false);
      assert.strictEqual(canAccessAdmin("PLAYER"), false);
      assert.strictEqual(canAccessAdmin("GUEST"), false);
      assert.strictEqual(canAccessAdmin(""), false);
    });

    it("should enforce editor authorization boundary", () => {
      assert.strictEqual(canAccessEditor("DEVELOPER"), true);
      assert.strictEqual(canAccessEditor("EDITOR"), true);
      assert.strictEqual(canAccessEditor("SUPPORT"), false);
      assert.strictEqual(canAccessEditor("USER"), false);
    });
  });

  describe("2. Granular Permissions Engine", () => {
    it("should grant full bypass to executive roles (OWNER, FOUNDER, BREAK_GLASS)", () => {
      assert.strictEqual(can({ role: "OWNER" }, "games.publish"), true);
      assert.strictEqual(can({ role: "FOUNDER" }, "database.delete"), true);
      assert.strictEqual(can({ role: "BREAK_GLASS" }, "security.manage"), true);
    });

    it("should verify explicit permissions for non-executive staff", () => {
      const dev = { role: "DEVELOPER", permissions: JSON.stringify(["games.manage", "games.edit"]) };
      assert.strictEqual(can(dev, "games.manage"), true);
      assert.strictEqual(can(dev, "games.edit"), true);
      assert.strictEqual(can(dev, "settings.manage"), false);
      assert.strictEqual(can(dev, "users.delete"), false);
    });

    it("should support wildcard permissions (*)", () => {
      const superAdmin = { role: "ADMIN", permissions: JSON.stringify(["*"]) };
      assert.strictEqual(can(superAdmin, "anything.really"), true);
    });

    it("should reject corrupted or invalid permissions JSON", () => {
      const badUser = { role: "DEVELOPER", permissions: "{corrupt_json" };
      assert.strictEqual(can(badUser, "games.manage"), false);
    });
  });

  describe("3. Account Protection & Immutability Guards", () => {
    it("should prevent any role from modifying or deleting BREAK_GLASS accounts", () => {
      const attempt = canModifyUser("OWNER", "BREAK_GLASS");
      assert.strictEqual(attempt.allowed, false);
      assert.match(attempt.reason || "", /Break Glass account is immutable/);
    });

    it("should prevent non-owners from modifying or deleting OWNER accounts", () => {
      const attempt = canModifyUser("ADMIN", "OWNER");
      assert.strictEqual(attempt.allowed, false);
      assert.match(attempt.reason || "", /Owner account cannot be deleted/);
    });

    it("should prevent lower rank roles from modifying higher rank accounts", () => {
      const attempt = canModifyUser("DEVELOPER", "ADMIN");
      assert.strictEqual(attempt.allowed, false);
      assert.match(attempt.reason || "", /Insufficient rank hierarchy/);
    });
  });

  describe("4. Dual-Approval Critical Actions", () => {
    it("should flag catastrophic operations as requiring dual approval", () => {
      assert.strictEqual(requiresDualApproval("DELETE_PRODUCTION_DATABASE"), true);
      assert.strictEqual(requiresDualApproval("PURGE_ALL_USERS"), true);
      assert.strictEqual(requiresDualApproval("REVOKE_ALL_API_KEYS"), true);
      assert.strictEqual(requiresDualApproval("SYSTEM_RESET"), true);
    });

    it("should not require dual approval for ordinary publishing actions", () => {
      assert.strictEqual(requiresDualApproval("PUBLISH_GAME"), false);
      assert.strictEqual(requiresDualApproval("UPDATE_CMS_BLOCK"), false);
    });
  });

  describe("5. Military Password Policy & Dragon Key Tokens", () => {
    it("should enforce military-grade password complexity (16+ chars, multi-entropy)", () => {
      assert.strictEqual(validateMilitaryPasswordPolicy("WeakPass1!").valid, false);
      assert.strictEqual(validateMilitaryPasswordPolicy("LongPasswordWithoutDigitsAndSymbols!").valid, false);
      assert.strictEqual(validateMilitaryPasswordPolicy("Dragon#Master#Key#2026!Pro").valid, true);
    });

    it("should generate structured 256-bit Dragon Key tokens", () => {
      const key = generateDragonKey("ADMIN");
      assert.match(key.rawKey, /^DRAGON-ADMIN-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+$/);
      assert.match(key.prefix, /^DRAGON-ADMIN-[A-Z0-9]+$/);
    });
  });
});
