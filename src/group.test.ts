import { beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { groupAlerts, type Alert, type PackageGroup } from "./group.ts";

const alert = (
  id: number,
  ecosystem: string,
  name: string,
  severity = "low",
): Alert => ({
  html_url: `https://github.com/o/a/security/dependabot/${id}`,
  dependency: { package: { ecosystem, name } },
  security_advisory: { severity },
});

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
        alert(1, "npm", "lodash"),
        alert(2, "npm", "lodash"),
      ]);
    });

    it("returns one group", () => {
      assert.equal(result.length, 1);
    });

    it("identifies the package", () => {
      assert.equal(result[0].ecosystem, "npm");
      assert.equal(result[0].name, "lodash");
    });

    it("includes both urls", () => {
      assert.deepEqual(result[0].urls, [
        "https://github.com/o/a/security/dependabot/1",
        "https://github.com/o/a/security/dependabot/2",
      ]);
    });
  });

  describe("with alerts for different packages", () => {
    let result: PackageGroup[];

    beforeEach(() => {
      result = groupAlerts([
        alert(1, "npm", "lodash"),
        alert(2, "pip", "django"),
        alert(3, "pip", "django"),
      ]);
    });

    it("returns a group per package, most alerts first", () => {
      assert.deepEqual(
        result.map((group) => group.name),
        ["django", "lodash"],
      );
    });
  });

  describe("with same package name in different ecosystems", () => {
    let result: PackageGroup[];

    beforeEach(() => {
      result = groupAlerts([
        alert(1, "npm", "requests"),
        alert(2, "pip", "requests"),
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
        alert(1, "pip", "GitPython"),
        alert(2, "pip", "gitpython"),
      ]);
    });

    it("groups them together", () => {
      assert.equal(result.length, 1);
    });
  });

  describe("with alerts of mixed severity for one package", () => {
    let result: PackageGroup[];

    beforeEach(() => {
      result = groupAlerts([
        alert(1, "npm", "lodash", "critical"),
        alert(2, "npm", "lodash", "high"),
        alert(3, "npm", "lodash", "high"),
        alert(4, "npm", "lodash", "low"),
      ]);
    });

    it("counts alerts by severity", () => {
      assert.deepEqual(result[0].severities, {
        critical: 1,
        high: 2,
        medium: 0,
        low: 1,
      });
    });
  });

  describe("with a package with more severe alerts but fewer in total", () => {
    let result: PackageGroup[];

    beforeEach(() => {
      result = groupAlerts([
        alert(1, "npm", "lodash", "high"),
        alert(2, "npm", "lodash", "high"),
        alert(3, "npm", "lodash", "high"),
        alert(4, "npm", "axios", "critical"),
      ]);
    });

    it("puts the more severe package first", () => {
      assert.deepEqual(
        result.map((group) => group.name),
        ["axios", "lodash"],
      );
    });
  });

  describe("with packages sharing their most severe level", () => {
    let result: PackageGroup[];

    beforeEach(() => {
      result = groupAlerts([
        alert(1, "npm", "lodash", "high"),
        alert(2, "npm", "lodash", "low"),
        alert(3, "npm", "lodash", "low"),
        alert(4, "npm", "axios", "high"),
        alert(5, "npm", "axios", "high"),
      ]);
    });

    it("puts the package with more alerts at that level first", () => {
      assert.deepEqual(
        result.map((group) => group.name),
        ["axios", "lodash"],
      );
    });
  });
});
