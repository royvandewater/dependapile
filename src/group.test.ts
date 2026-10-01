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
});
