# PC Builder — updated frontend design

Uses your uploaded src design. App.tsx, App.css, index.css and design assets are unchanged.
Catalog and details placeholders display local product photos. Manufacturer URLs are removed from displayed descriptions, without modifying the database.

## Install on Windows
1. Extract this ZIP.
2. In PC_forntend, run npm.cmd install.
3. Copy .env.example to .env (or keep your existing .env).
4. Set VITE_API_URL=http://127.0.0.1:5000/api
5. Start your existing backend from its root: npm.cmd run dev
6. In PC_forntend, run npm.cmd run dev and open the URL Vite prints.

To update an existing project, back it up first, then replace src and copy public from this package. Keep your existing .env.

## Images
Images belong in frontend/public/parts. Vite serves them at /parts/filename, not /public/parts/filename.
The catalogImages.ts mapping matches backend SKU values to 53 images covering the 61 seeded real components.
Product-family photos are labeled. Unknown or missing SKUs show Photo unavailable.
This package does not insert components into MongoDB; the real catalog must already be imported.
Source credits are in PHOTO_SOURCES.md and are not displayed in the interface.

## Existing uploaded behavior
Components load from the backend API. Saved builds and draft use browser localStorage.
Admin edits exist only in memory and reset on reload. Compatibility checks use the uploaded frontend logic.
This update preserves those behaviors; it does not add backend persistence for builds or admin changes.
