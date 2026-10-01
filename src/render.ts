import type { PackageGroup } from "./group.ts";

export const renderReport = (org: string, groups: PackageGroup[]): string =>
  groups.map((group) => group.name).join("");
