# Architecture — MM-CompMatrix2

## Overview

A Vite + React single-page app that shows CNC machine compatibility with MillMage software. Two modes:

- **Public** — Read-only search and table view (default)
- **Admin** — Password-protected editing, add/delete rows, CSV import/export, JSON import/export

## Data Flow

```
machines.json (static default)
        │
        ▼
  useMachines hook ──► localStorage (admin edits persisted here)
        │
        ▼
   App.jsx (state owner)
   ├── SearchInput + DetailCard  (search panel)
   └── PublicTable / AdminTable  (database table)
```

1. On load, `useMachines` checks `localStorage` for saved data. Falls back to fetching `/data/machines.json`.
2. Admin CRUD operations update React state and sync to `localStorage`.
3. `resetDB` re-fetches the original JSON and overwrites localStorage.

## Component Tree

```
App
├── PasswordPrompt        (modal, shown when entering admin mode)
├── SearchInput           (fuzzy search bar + dropdown results)
│   └── (inline results)
├── DetailCard            (compatibility detail for a selected machine)
├── PublicTable           (read-only filtered table)
└── AdminTable            (editable table with inline EditRow)
    └── EditRow           (inline editing form within table row)
```

## Shared Utilities

- **`src/data/compatLevels.js`** — `CC` object (colors, labels, icons per compat level), `COMPAT_OPTS` array, `FIELDS` array
- **`src/data/scoring.js`** — `norm()` normalizer, `score()` fuzzy match scorer

## Password Strategy

Two modes for providing the admin password:

| Deployment | Mechanism | How it works |
|---|---|---|
| Vercel | `VITE_ADMIN_PASSWORD` env var | Baked into JS bundle at build time via `import.meta.env.VITE_ADMIN_PASSWORD` |
| Docker | `ADMIN_PASSWORD` env var | `docker-entrypoint.sh` generates `env.js` at container start → `window.__ENV__.ADMIN_PASSWORD` |

The `PasswordPrompt` component checks: `import.meta.env.VITE_ADMIN_PASSWORD || window.__ENV__?.ADMIN_PASSWORD`

**Security note:** The password is visible in the client bundle. This is acceptable — the data is non-sensitive CNC compatibility info.

## Docker

No host Node.js required. All workflows run inside Docker containers.

- **Image:** `mm-compmatrix`
- **Tags:** `0.1.0` + `latest`
- **Tar:** `mm-compmatrix.tar`

### Scripts

| Script | Purpose |
|---|---|
| `./docker-dev.sh` | Containerized Vite dev server with hot-reload (port 5173) |
| `./docker-build.sh` | Build + dual-tag the production image |
| `./docker-build.sh --export` | Build + export to `mm-compmatrix.tar` |

### Manual Commands

- **Build:** `docker build --platform linux/amd64 -t mm-compmatrix:0.1.0 -t mm-compmatrix:latest .`
- **Export:** `docker save -o mm-compmatrix.tar mm-compmatrix:0.1.0 mm-compmatrix:latest`
- **Run:** `docker run -d -p 8080:80 -e ADMIN_PASSWORD=mysecret mm-compmatrix:latest`

## File Map

| File | Purpose |
|---|---|
| `public/data/machines.json` | 311 machines — default database |
| `src/main.jsx` | React root |
| `src/App.jsx` | Mode toggle, auth gate, layout |
| `src/hooks/useMachines.js` | Load/save/CRUD state management, CSV & JSON import/export |
| `src/data/compatLevels.js` | CC colors/labels/icons |
| `src/data/scoring.js` | Fuzzy search |
| `src/components/PasswordPrompt.jsx` | Admin password dialog |
| `src/components/SearchInput.jsx` | Search bar with dropdown |
| `src/components/DetailCard.jsx` | Machine detail card |
| `src/components/PublicTable.jsx` | Read-only table |
| `src/components/AdminTable.jsx` | Editable table |
| `src/components/EditRow.jsx` | Inline row editor |
