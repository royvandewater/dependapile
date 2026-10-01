import { beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { groupAlerts, type PackageGroup } from "./group.ts";

describe("groupAlerts", () => {
  describe("with no alerts", () => {
    let result: PackageGroup[];

    beforeEach(() => {
      result = groupAlerts([]);
    });

    it("returns no groups", () => {
      assert.deepEqual(result, []);
    });
  });

  describe("with two alerts for the same package", () => {
    let result: PackageGroup[];

    beforeEach(() => {
      result = groupAlerts([
        {
          html_url: "https://github.com/o/a/security/dependabot/1",
          dependency: { package: { ecosystem: "npm", name: "lodash" } },
        },
        {
          html_url: "https://github.com/o/b/security/dependabot/2",
          dependency: { package: { ecosystem: "npm", name: "lodash" } },
        },
      ]);
    });

    it("returns one group with both urls", () => {
      assert.deepEqual(result, [
        {
          ecosystem: "npm",
          name: "lodash",
          urls: [
            "https://github.com/o/a/security/dependabot/1",
            "https://github.com/o/b/security/dependabot/2",
          ],
        },
      ]);
    });
  });

  describe("with alerts for different packages", () => {
    let result: PackageGroup[];

    beforeEach(() => {
      result = groupAlerts([
        {
          html_url: "https://github.com/o/a/security/dependabot/1",
          dependency: { package: { ecosystem: "npm", name: "lodash" } },
        },
        {
          html_url: "https://github.com/o/a/security/dependabot/2",
          dependency: { package: { ecosystem: "pip", name: "django" } },
        },
        {
          html_url: "https://github.com/o/b/security/dependabot/3",
          dependency: { package: { ecosystem: "pip", name: "django" } },
        },
      ]);
    });

    it("returns a group per package, most alerts first", () => {
      assert.deepEqual(result, [
        {
          ecosystem: "pip",
          name: "django",
          urls: [
            "https://github.com/o/a/security/dependabot/2",
            "https://github.com/o/b/security/dependabot/3",
          ],
        },
        {
          ecosystem: "npm",
          name: "lodash",
          urls: ["https://github.com/o/a/security/dependabot/1"],
        },
      ]);
    });
  });

  describe("with same package name in different ecosystems", () => {
    let result: PackageGroup[];

    beforeEach(() => {
      result = groupAlerts([
        {
          html_url: "https://github.com/o/a/security/dependabot/1",
          dependency: { package: { ecosystem: "npm", name: "requests" } },
        },
        {
          html_url: "https://github.com/o/a/security/dependabot/2",
          dependency: { package: { ecosystem: "pip", name: "requests" } },
        },
      ]);
    });

    it("keeps them separate", () => {
      assert.equal(result.length, 2);
    });
  });

  describe("with package names differing only by case", () => {
    let result: PackageGroup[];

    beforeEach(() => {
      result = groupAlerts([
        {
          html_url: "https://github.com/o/a/security/dependabot/1",
          dependency: { package: { ecosystem: "pip", name: "GitPython" } },
        },
        {
          html_url: "https://github.com/o/b/security/dependabot/2",
          dependency: { package: { ecosystem: "pip", name: "gitpython" } },
        },
      ]);
    });

    it("groups them together", () => {
      assert.equal(result.length, 1);
    });
  });
});
