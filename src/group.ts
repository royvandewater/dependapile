export type Alert = {
  html_url: string;
  dependency: { package: { ecosystem: string; name: string } };
};

export type PackageGroup = {
  ecosystem: string;
  name: string;
  urls: string[];
};

export const groupAlerts = (alerts: Alert[]): PackageGroup[] => {
  if (alerts.length === 0) return [];
  const { ecosystem, name } = alerts[0].dependency.package;
  return [{ ecosystem, name, urls: alerts.map((alert) => alert.html_url) }];
};
