import { beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { fetchAlerts } from "./fetch.ts";
import type { Alert } from "./group.ts";

const alert = (id: number): Alert => ({
  html_url: `https://github.com/o/a/security/dependabot/${id}`,
  dependency: { package: { ecosystem: "npm", name: "lodash" } },
});

describe("fetchAlerts", () => {
  describe("when gh returns multiple pages", () => {
    let args: string[];
    let result: Alert[];

    beforeEach(async () => {
      result = await fetchAlerts("acme", async (ghArgs) => {
        args = ghArgs;
        return JSON.stringify([[alert(1)], [alert(2)]]);
      });
    });

    it("queries open alerts for the org", () => {
      assert.deepEqual(args, [
        "api",
        "--paginate",
        "--slurp",
        "/orgs/acme/dependabot/alerts?state=open&per_page=100",
      ]);
    });

    it("returns alerts from every page", () => {
      assert.deepEqual(result, [alert(1), alert(2)]);
    });
  });
});
