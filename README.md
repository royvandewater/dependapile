# dependapile

Serves an HTML report of a GitHub org's open Dependabot alerts, grouped by package, with a button to copy each package's alert URLs as a newline separated list.

Requires Node 24+ and an authenticated `gh` CLI.

```sh
pnpm start <github-org> [port]
pnpm test
```

Alerts are fetched fresh on every page load.
