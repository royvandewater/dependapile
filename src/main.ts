import assert from "node:assert/strict";
import { fetchAlerts } from "./fetch.ts";
import { createReportServer } from "./server.ts";

const org = process.argv[2];
assert(org, new Error("Usage: pnpm start <github-org> [port]"));
const port = Number(process.argv[3] ?? 3000);

createReportServer(org, (org) => fetchAlerts(org)).listen(port, () => {
  console.log(`Serving ${org} Dependabot report at http://localhost:${port}/`);
});
