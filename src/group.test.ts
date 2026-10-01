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
});
