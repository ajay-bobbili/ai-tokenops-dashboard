# AI TokenOps Dashboard

**Track. Limit. Optimise your AI token spend.**

Live demo: https://ajay-bobbili.github.io/ai-tokenops-dashboard/

**Free agent skill:** get [TokenOps on Agensi](https://www.agensi.io/skills/tokenops-claude-usage-limits-and-savings) or [download the ZIP from GitHub Releases](https://github.com/ajay-bobbili/ai-tokenops-dashboard/releases/tag/skill-v1.1.0). Ask your AI coding agent about your Claude Code spend, limits and savings in plain language. Unofficial, not affiliated with Anthropic.

A local, privacy-first dashboard that shows how much of Claude you're using, which models you're using, and where you could save money.

It reads the usage logs Claude Code already saves on your computer (`~/.claude/projects`). Nothing is uploaded and no API key is needed. A small Node.js server runs at `localhost:4317` and parses those logs. The page is plain HTML, CSS and JavaScript with no dependencies.

## Features

- **Daily and weekly limits**: ring gauges, live reset countdowns, pace projections and status tags. Limits are personal targets you set.
- **Usage at a glance**: total tokens, estimated cost and requests, with trend lines.
- **Model tracking**: animated token chart by model (Opus, Sonnet, Haiku, ...) and cost share donut.
- **Cost breakdowns**: cost per day and cost by project.
- **Active-days calendar**: GitHub-style squares with current and longest streaks.
- **⚡ Optimise**: scores each request and shows where a cheaper model would have done the job, with potential savings and tips.
- **₹ / $ toggle** for every figure.
- A small peeking mascot, because why not.

## Use it as an agent skill (free)

TokenOps also comes as an installable skill: you ask your AI coding agent about your Claude Code usage in plain language, and it runs the report on your own computer. Nothing is uploaded and there are no network calls.

- **Get it:** from [Agensi](https://www.agensi.io/skills/tokenops-claude-usage-limits-and-savings), or download `tokenops-skill-1.1.0.zip` from [GitHub Releases](https://github.com/ajay-bobbili/ai-tokenops-dashboard/releases/tag/skill-v1.1.0) (MIT licensed, with the license inside the ZIP).
- **Install from the ZIP:** unzip it into your Claude Code skills folder so that `SKILL.md` sits directly inside a folder named `tokenops`: `~/.claude/skills/tokenops/` on macOS and Linux, `%USERPROFILE%\.claude\skills\tokenops\` on Windows. If your setup keeps skills elsewhere, check your agent's skills documentation. Then start a new session.
- **Try asking:** "How much have I spent on Claude Code this week and where can I save money?"
- **Requires:** Node.js 18 or newer and Claude Code session logs on the same machine.

You can also run the scripts yourself from the unzipped folder:

```bash
# Markdown report with budgets (limits are in the display currency)
node scripts/tokenops.mjs --days 30 --daily 60 --weekly 300

# One-page HTML report
node scripts/tokenops.mjs --json --daily 60 --weekly 300 | node scripts/report-html.mjs --out tokenops-report.html

# One-line status for your own Claude Code status line, and a check mode with exit codes 0, 1, 2
node scripts/tokenops.mjs --json --daily 60 | node scripts/tokenops-out.mjs statusline
node scripts/tokenops.mjs --json --daily 60 | node scripts/tokenops-out.mjs check

# CSV tables: daily, models, projects or tools
node scripts/tokenops.mjs --json | node scripts/tokenops-out.mjs csv daily
```

Compared with this dashboard, the skill adds an agent-readable report, limit alerts at the top of the report, the status-line and check modes, and CSV straight from the terminal. It reports on Claude Code only, and costs are estimates at API list prices. The skill's files are distributed through the release ZIP and Agensi; this repository holds the web dashboard.

## Two ways to use it

### 1. Hosted on GitHub Pages (nothing to install)

Open the hosted page, then **link your Claude logs**. Your files are read inside your browser and are never uploaded; the page has no backend.

1. Claude Code saves every session as a `.jsonl` file in a hidden folder:

   | OS | Folder |
   |---|---|
   | Windows | `%USERPROFILE%\.claude\projects` |
   | macOS | `~/.claude/projects` |
   | Linux | `~/.claude/projects` |

2. Click **Choose folder** and select that `projects` folder (the whole folder, not one project). It is hidden, so paste the path into the dialog's address bar (Windows), press `Cmd+Shift+G` (macOS) or `Ctrl+H` (Linux).
3. Your dashboard appears. Next time press **🔗 Link Claude** to refresh. Parsed data is cached in your own browser (IndexedDB) only.

Best in Chrome, Edge or Brave (they remember the folder). Firefox and Safari fall back to a one-time folder upload that still stays on your machine. Click **Try demo data** to explore with sample numbers first.

### 2. Run locally with live updates

Requires [Node.js](https://nodejs.org) 18+.

```bash
node server.js
```

Open http://localhost:4317 (on Windows you can double-click `start.bat`). The server reads your logs directly and refreshes every minute. Set `CLAUDE_PROJECTS` to read logs from a different folder and `PORT` to change the port.

## Publish your own copy on GitHub Pages

1. Fork or push this repo to GitHub (Pages on a private repo needs a paid plan, so make it public on the free plan).
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main`. The workflow in `.github/workflows/pages.yml` deploys the `public/` folder to `https://<user>.github.io/<repo>/`.

## Notes

- Costs are estimates of the same usage at pay-per-token API prices, not your subscription bill. Edit `PRICES` and `USD_INR` at the top of the script in `public/index.html`.
- Claude's own plan limits are not stored in local logs, so the limits are targets you configure under **⚙ Limits**.
- Only Claude Code activity is visible, not the claude.ai chat app.
- The logo and mascot ("Tokie", the chip bot) are original artwork. Claude and Claude Code are trademarks of Anthropic, PBC.

## Credits

- Unofficial project, not affiliated with Anthropic. Claude and Claude Code are trademarks of [Anthropic, PBC](https://www.anthropic.com).
- Usage data comes from the session logs written by [Claude Code](https://claude.com/claude-code).
- Built with Claude Code by [@ajay-bobbili](https://github.com/ajay-bobbili).

## Files

| File | Purpose |
|---|---|
| `server.js` | Reads and de-duplicates Claude Code logs, serves them as JSON |
| `public/index.html` | The whole dashboard UI |
| `start.bat` | One-click Windows launcher |
| `.github/workflows/pages.yml` | Deploys `public/` to GitHub Pages |

## License

MIT. See [LICENSE](LICENSE). Copyright (c) 2026 ajay-bobbili. The license covers this repository's code and artwork; Claude and Claude Code remain trademarks of Anthropic, PBC.
