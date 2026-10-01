import { beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderReport } from "./render.ts";

describe("renderReport", () => {
  describe("with a package group", () => {
    let html: string;

    beforeEach(() => {
      html = renderReport("acme", [
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

    it("includes the package name", () => {
      assert.match(html, /lodash/);
    });
  });
});
