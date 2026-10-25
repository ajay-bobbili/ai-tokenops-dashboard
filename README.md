# Claude Usage Dashboard

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

## Run it

Requires [Node.js](https://nodejs.org) 18+.

```bash
node server.js
```

Open http://localhost:4317 (on Windows you can double-click `start.bat`).

Set `CLAUDE_PROJECTS` to read logs from a different folder, and `PORT` to change the port.

## Notes

- Costs are estimates of the same usage at pay-per-token API prices, not your subscription bill. Edit `PRICES` and `USD_INR` at the top of the script in `public/index.html`.
- Claude's own plan limits are not stored in local logs, so the limits are targets you configure under **⚙ Limits**.
- Only Claude Code activity is visible, not the claude.ai chat app.
- The logo and mascot are hand-drawn imitations. Claude and Anthropic marks belong to Anthropic.

## Files

| File | Purpose |
|---|---|
| `server.js` | Reads and de-duplicates Claude Code logs, serves them as JSON |
| `public/index.html` | The whole dashboard UI |
| `start.bat` | One-click Windows launcher |
