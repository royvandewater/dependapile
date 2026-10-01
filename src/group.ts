export type Alert = {
  html_url: string;
  dependency: { package: { ecosystem: string; name: string } };
  security_advisory: { severity: string };
};

export type PackageGroup = {
  ecosystem: string;
  name: string;
  urls: string[];
};

export const groupAlerts = (alerts: Alert[]): PackageGroup[] => {
  const groups = new Map<string, PackageGroup>();
  for (const alert of alerts) {
    const { ecosystem, name } = alert.dependency.package;
    const key = `${ecosystem}:${name.toLowerCase()}`;
    const group = groups.get(key) ?? { ecosystem, name, urls: [] };
    group.urls.push(alert.html_url);
    groups.set(key, group);
  }
  return [...groups.values()].sort((a, b) => b.urls.length - a.urls.length);
};
