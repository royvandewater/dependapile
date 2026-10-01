import { afterEach, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { createReportServer } from "./server.ts";

describe("createReportServer", () => {
  describe("when the report is requested", () => {
    let server: Server;
    let response: Response;
    let body: string;

    beforeEach(async () => {
      server = createReportServer("acme", async () => [
        {
          html_url: "https://github.com/o/a/security/dependabot/1",
          dependency: { package: { ecosystem: "npm", name: "lodash" } },
        },
      ]);
      await new Promise<void>((resolve) => server.listen(0, resolve));
      const { port } = server.address() as AddressInfo;
      response = await fetch(`http://localhost:${port}/`);
      body = await response.text();
    });

    afterEach(() => {
      server.close();
    });

    it("responds with html", () => {
      const contentType = response.headers.get("content-type");
      assert.ok(contentType);
      assert.match(contentType, /text\/html/);
    });

    it("renders the grouped alerts", () => {
      assert.match(body, /lodash/);
      assert.match(body, /1 alert\b/);
    });
  });
});
