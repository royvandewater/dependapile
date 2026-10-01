import { createServer, type Server } from "node:http";
import { groupAlerts, type Alert } from "./group.ts";
import { renderReport } from "./render.ts";

export const createReportServer = (
  org: string,
  fetchAlerts: (org: string) => Promise<Alert[]>,
): Server =>
  createServer(async (_request, response) => {
    const html = renderReport(org, groupAlerts(await fetchAlerts(org)));
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    response.end(html);
  });
