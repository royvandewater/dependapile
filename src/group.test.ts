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
});
