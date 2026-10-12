# Kwyjibo

Kwyjibo is a simple flashcard app with big ambitions.

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

### React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

### Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

### Deploying to Apache

Set the `homepage` field in `package.json` to the public URL where the app will be hosted. Vite uses its pathname as the build base, including when the app is hosted in a subdirectory.

Run `npm run build`, then upload the contents of `dist/` to the matching Apache directory. The build generates an `.htaccess` file that serves existing files directly and falls back to `index.html` for other paths, including paths that match directory names. Within `data/`, only existing `.k` files are served; directory listings and other files are denied. Add a `.k` file to the server's `data/` directory and use its filename without the extension in the app route to load it; no manifest update is needed. Apache must have `mod_rewrite` enabled and allow `Options` and rewrite overrides for that directory.
