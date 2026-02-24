---
name: Fix frontend monorepo config
overview: "The only broken configuration is in `frontend/jsconfig.json`: the `@/*` path alias still points to the old monorepo-relative path `frontend/src/*` instead of a path relative to the frontend directory. Vite, Tailwind, and index.html are already correct."
todos: []
isProject: false
---

# Fix frontend monorepo configuration

## Summary

After moving the Vue app into `frontend/`, the dev server runs but Vite (via esbuild) reports:

```text
Non-relative path "frontend/src/*" is not allowed when "baseUrl" is not set
```

So the **only change required** is in [frontend/jsconfig.json](frontend/jsconfig.json). The other three areas you asked about are already correct.

---

## 1. `frontend/vite.config.js` — no change

The alias is already correct:

```javascript
'@': fileURLToPath(new URL('./src', import.meta.url))
```

`import.meta.url` is the config file’s URL (`.../frontend/vite.config.js`), so `./src` resolves to `frontend/src`. No fix needed.

---

## 2. `frontend/jsconfig.json` — fix required

**Current (wrong):**

```json
{"compilerOptions":{"paths":{"@/*":["frontend/src/*"]}},"exclude":["node_modules","dist"]}
```

When the project root for the frontend is `frontend/`, `"frontend/src/*"` is a non-relative path and triggers the warning. Paths in `compilerOptions.paths` must be relative to `baseUrl`.

**Change to:**

- Set `compilerOptions.baseUrl` to `"."` so paths resolve from the `frontend/` directory.
- Set `paths["@/*"]` to `["./src/*"]`.

Resulting `frontend/jsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```

This removes the warning and keeps the `@` alias consistent with Vite.

---

## 3. `frontend/tailwind.config.js` — no change

Content is already correct:

```javascript
content: [
  "./index.html",
  "./src/**/*.{vue,js,ts,jsx,tsx}",
],
```

Those paths are relative to the config file (`frontend/tailwind.config.js`), so they correctly target `frontend/index.html` and `frontend/src/**/*`. No change needed.

---

## 4. `frontend/index.html` — no change

The script tag is correct:

```html
<script type="module" src="/src/main.js"></script>
```

Vite’s root is the directory containing the config (i.e. `frontend/`), so `/src/main.js` resolves to `frontend/src/main.js`. No change needed.

---

## Action checklist


| Item                                                       | Action                                                                              |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [frontend/jsconfig.json](frontend/jsconfig.json)           | Add `"baseUrl": "."` and change `"@/*"` from `["frontend/src/*"]` to `["./src/*"]`. |
| [frontend/vite.config.js](frontend/vite.config.js)         | No change.                                                                          |
| [frontend/tailwind.config.js](frontend/tailwind.config.js) | No change.                                                                          |
| [frontend/index.html](frontend/index.html)                 | No change.                                                                          |


After updating `jsconfig.json`, run `npm run dev` from `frontend/` again; the warning should be gone and the Vue app should load as before.