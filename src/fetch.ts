import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { Alert } from "./group.ts";

export type GhRunner = (args: string[]) => Promise<string>;

export const runGh: GhRunner = async (args) => {
  const { stdout } = await promisify(execFile)("gh", args, {
    maxBuffer: 1024 * 1024 * 1024,
  });
  return stdout;
};

export const fetchAlerts = async (
  org: string,
  gh: GhRunner = runGh,
): Promise<Alert[]> => {
  const pages: Alert[][] = JSON.parse(
    await gh([
      "api",
      "--paginate",
      "--slurp",
      `/orgs/${org}/dependabot/alerts?state=open&per_page=100`,
    ]),
  );
  return pages.flat();
};
