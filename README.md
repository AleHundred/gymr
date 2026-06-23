# Gymr

Personal, phone-first training tracker. Installable PWA, offline-capable, persistent. Logs gym
sessions and computes each session's target via double progression (rep ladder). 

<div align="center"><img width="1206" height="2195" alt="image" src="https://github.com/user-attachments/assets/48392a21-3b03-4750-a025-1311a81ba695" /></div>

  

## Stack

React 18 + Vite · localStorage persistence · `vite-plugin-pwa` (Workbox) · Recharts (Phase 2) · deploy to Vercel/Netlify.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/
npm run preview    # serve the built PWA (test offline + install here)
npm run icons      # regenerate app icons (public/*.png)
```

PWA features (service worker, install, offline) only work over HTTPS or `localhost`. Use
`npm run preview` or the deployed URL, not the raw `dist/index.html` over `file://`.

## How it works

- **Persistence.** Whole app state lives in `localStorage` under `tt_state_v1`, versioned for
  migration. The in-progress session (draft) is persisted too, so backgrounding the app mid-set
  loses nothing. Saves are debounced ~300ms.
- **Progression** (`src/lib/progression.js`). Work reps `repLow` to `repHigh` (10 to 12). When all
  sets hit 12, +2.5kg and reset to 10. Bad day (regression vs prior session) repeats the better one.
- **Backup.** History tab, Export/Import JSON. The localStorage safety net: one tap backs up the
  whole logbook to a file.

## Architecture

```
src/
  App.jsx                  tab shell
  data/seed.js             exercise template + defaults (final, per spec)
  data/svgs.js             machine illustrations
  lib/
    storage.js             localStorage get/set/migrate
    reducer.js             AppState reducer (LOG_SET, FINISH_SESSION, IMPORT, RESET)
    useAppState.js         hook: hydrate + debounced persist
    progression.js         computeTarget + beatLogbook (the core logic)
    ids.js                 uid() + num() helpers
  components/
    TabBar / SessionView / ExerciseCard / SetLogger
    HistoryView / ImportExport / RulesView
```

