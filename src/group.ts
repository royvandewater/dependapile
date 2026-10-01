import assert from "node:assert/strict";

export const SEVERITIES = ["critical", "high", "medium", "low"] as const;

export type Severity = (typeof SEVERITIES)[number];

export type Alert = {
  html_url: string;
  dependency: { package: { ecosystem: string; name: string } };
  security_advisory: { severity: string };
};

export type PackageGroup = {
  ecosystem: string;
  name: string;
  urls: string[];
  severities: Record<Severity, number>;
};

const isSeverity = (value: string): value is Severity =>
  (SEVERITIES as readonly string[]).includes(value);

export const groupAlerts = (alerts: Alert[]): PackageGroup[] => {
  const groups = new Map<string, PackageGroup>();
  for (const alert of alerts) {
    const { ecosystem, name } = alert.dependency.package;
    const { severity } = alert.security_advisory;
    assert(isSeverity(severity), new Error(`Unknown severity: ${severity}`));
    const key = `${ecosystem}:${name.toLowerCase()}`;
    const group = groups.get(key) ?? {
      ecosystem,
      name,
      urls: [],
      severities: { critical: 0, high: 0, medium: 0, low: 0 },
    };
    group.urls.push(alert.html_url);
    group.severities[severity] += 1;
    groups.set(key, group);
  }
  return [...groups.values()].sort((a, b) => b.urls.length - a.urls.length);
};
