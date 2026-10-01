export type Alert = {
  html_url: string;
  dependency: { package: { ecosystem: string; name: string } };
};

export type PackageGroup = {
  ecosystem: string;
  name: string;
  urls: string[];
};

export const groupAlerts = (alerts: Alert[]): PackageGroup[] => [];
