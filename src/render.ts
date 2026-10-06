import { SEVERITIES, type PackageGroup } from "./group.ts";

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const pluralize = (count: number): string =>
  count === 1 ? "1 alert" : `${count} alerts`;

const renderSeverities = (group: PackageGroup): string =>
  SEVERITIES.map((severity) => {
    const count = group.severities[severity];
    const empty = count === 0 ? " empty" : "";
    return `<span class="severity ${severity}${empty}">${count} ${severity}</span>`;
  }).join("");

const renderGroup = (group: PackageGroup, index: number): string => `
    <li class="group">
      <div class="info">
        <span class="name">${escapeHtml(group.name)}</span>
        <span class="ecosystem">${escapeHtml(group.ecosystem)}</span>
        <span class="count">${pluralize(group.urls.length)}</span>
        <span class="severities">${renderSeverities(group)}</span>
      </div>
      <button type="button" data-target="urls-${index}">Copy URLs</button>
      <pre id="urls-${index}" hidden>${escapeHtml(group.urls.join("\n"))}</pre>
    </li>`;

const DARK_THEME =
  "--bg: #0d1117; --fg: #e6edf3; --muted: #8b949e; --card: #161b22; --border: #30363d; --accent: #2f81f7; --accent-fg: #fff; --critical: #ff8a80; --critical-bg: #3d1614; --high: #ffb27a; --high-bg: #3a2312; --medium: #e8c95a; --medium-bg: #332a0c; --low: #b1b8c0; --low-bg: #262c33;";

export const renderReport = (org: string, groups: PackageGroup[]): string => {
  const total = groups.reduce((sum, group) => sum + group.urls.length, 0);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dependabot Alerts</title>
  <script data-theme-init>
    try {
      const theme = localStorage.getItem("theme");
      if (theme) document.documentElement.dataset.theme = theme;
    } catch {}
  </script>
  <style>
    :root { --bg: #fafafa; --fg: #1a1a1a; --muted: #666; --card: #fff; --border: #e2e2e2; --accent: #0969da; --accent-fg: #fff; --critical: #b3261e; --critical-bg: #fde7e5; --high: #a8470a; --high-bg: #fdebdc; --medium: #7a5c00; --medium-bg: #fbf1cc; --low: #555; --low-bg: #ececec; }
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) { ${DARK_THEME} }
    }
    :root[data-theme="dark"] { ${DARK_THEME} }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 32px 16px; background: var(--bg); color: var(--fg); font: 15px/1.5 system-ui, sans-serif; }
    main { max-width: 760px; margin: 0 auto; }
    header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
    h1 { margin: 0 0 4px; font-size: 24px; }
    .summary { margin: 0 0 24px; color: var(--muted); }
    ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
    .group { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px; background: var(--card); border: 1px solid var(--border); border-radius: 8px; }
    .info { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 12px; min-width: 0; }
    .name { font-family: ui-monospace, monospace; font-weight: 600; overflow-wrap: anywhere; }
    .ecosystem, .count { color: var(--muted); font-size: 13px; }
    .severities { display: flex; flex-wrap: wrap; gap: 4px; flex-basis: 100%; }
    .severity { padding: 1px 8px; border-radius: 999px; font-size: 12px; font-weight: 600; }
    .severity.empty { opacity: 0.35; }
    .critical { color: var(--critical); background: var(--critical-bg); }
    .high { color: var(--high); background: var(--high-bg); }
    .medium { color: var(--medium); background: var(--medium-bg); }
    .low { color: var(--low); background: var(--low-bg); }
    button { flex-shrink: 0; padding: 6px 12px; border: 0; border-radius: 6px; background: var(--accent); color: var(--accent-fg); font: inherit; font-size: 13px; cursor: pointer; }
    button.copied { opacity: 0.7; }
    button.theme-toggle { background: var(--card); color: var(--fg); border: 1px solid var(--border); }
  </style>
</head>
<body>
  <main>
    <header>
      <div>
        <h1>${escapeHtml(org)} Dependabot alerts</h1>
        <p class="summary">${pluralize(total)} across ${groups.length} packages</p>
      </div>
      <button type="button" class="theme-toggle" data-theme-toggle>Toggle theme</button>
    </header>
    <ul>${groups.map(renderGroup).join("")}
    </ul>
  </main>
  <script type="module">
    const root = document.documentElement;
    const toggle = document.querySelector("button[data-theme-toggle]");
    const systemDark = matchMedia("(prefers-color-scheme: dark)");
    const currentTheme = () =>
      root.dataset.theme ?? (systemDark.matches ? "dark" : "light");
    const label = () => {
      toggle.textContent = currentTheme() === "dark" ? "Light mode" : "Dark mode";
    };
    label();
    systemDark.addEventListener("change", label);
    toggle.addEventListener("click", () => {
      const theme = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = theme;
      try {
        localStorage.setItem("theme", theme);
      } catch {}
      label();
    });

    for (const button of document.querySelectorAll("button[data-target]")) {
      button.addEventListener("click", async () => {
        const urls = document.getElementById(button.dataset.target).textContent;
        await navigator.clipboard.writeText(urls);
        button.textContent = "Copied!";
        button.classList.add("copied");
        setTimeout(() => {
          button.textContent = "Copy URLs";
          button.classList.remove("copied");
        }, 1500);
      });
    }
  </script>
</body>
</html>
`;
};
