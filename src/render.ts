import type { PackageGroup } from "./group.ts";

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const pluralize = (count: number): string =>
  count === 1 ? "1 alert" : `${count} alerts`;

const renderGroup = (group: PackageGroup, index: number): string => `
    <li class="group">
      <div class="info">
        <span class="name">${escapeHtml(group.name)}</span>
        <span class="ecosystem">${escapeHtml(group.ecosystem)}</span>
        <span class="count">${pluralize(group.urls.length)}</span>
      </div>
      <button type="button" data-target="urls-${index}">Copy URLs</button>
      <pre id="urls-${index}" hidden>${escapeHtml(group.urls.join("\n"))}</pre>
    </li>`;

export const renderReport = (org: string, groups: PackageGroup[]): string => {
  const total = groups.reduce((sum, group) => sum + group.urls.length, 0);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dependabot Alerts</title>
  <style>
    :root { --bg: #fafafa; --fg: #1a1a1a; --muted: #666; --card: #fff; --border: #e2e2e2; --accent: #0969da; --accent-fg: #fff; }
    @media (prefers-color-scheme: dark) {
      :root { --bg: #0d1117; --fg: #e6edf3; --muted: #8b949e; --card: #161b22; --border: #30363d; --accent: #2f81f7; --accent-fg: #fff; }
    }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 32px 16px; background: var(--bg); color: var(--fg); font: 15px/1.5 system-ui, sans-serif; }
    main { max-width: 760px; margin: 0 auto; }
    h1 { margin: 0 0 4px; font-size: 24px; }
    .summary { margin: 0 0 24px; color: var(--muted); }
    ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
    .group { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px; background: var(--card); border: 1px solid var(--border); border-radius: 8px; }
    .info { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 12px; min-width: 0; }
    .name { font-family: ui-monospace, monospace; font-weight: 600; overflow-wrap: anywhere; }
    .ecosystem, .count { color: var(--muted); font-size: 13px; }
    button { flex-shrink: 0; padding: 6px 12px; border: 0; border-radius: 6px; background: var(--accent); color: var(--accent-fg); font: inherit; font-size: 13px; cursor: pointer; }
    button.copied { opacity: 0.7; }
  </style>
</head>
<body>
  <main>
    <h1>${escapeHtml(org)} Dependabot alerts</h1>
    <p class="summary">${pluralize(total)} across ${groups.length} packages</p>
    <ul>${groups.map(renderGroup).join("")}
    </ul>
  </main>
  <script type="module">
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
