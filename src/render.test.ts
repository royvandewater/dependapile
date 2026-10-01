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

    it("includes the alert count", () => {
      assert.match(html, /\b2 alerts\b/);
    });

    it("includes the urls as a newline separated list to copy", () => {
      assert.ok(
        html.includes(
          "https://github.com/o/a/security/dependabot/1\nhttps://github.com/o/b/security/dependabot/2",
        ),
      );
    });

    it("includes a copy button", () => {
      assert.match(html, /<button[^>]*>Copy URLs<\/button>/);
    });
  });

  describe("with a package name containing html", () => {
    let html: string;

    beforeEach(() => {
      html = renderReport("acme", [
        { ecosystem: "npm", name: "<script>", urls: ["https://x/1"] },
      ]);
    });

    it("escapes it", () => {
      assert.ok(html.includes("&lt;script&gt;"));
      assert.ok(!html.includes("<script>"));
    });
  });
});
