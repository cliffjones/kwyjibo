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

Private `.k` files can be stored with a leading dot in their filename. To enable token-based loading, configure a strong `SALT` environment variable for the PHP process serving `private.php`. A token is the SHA-256 digest of a URL path segment concatenated with that salt, encoded as Base64URL (`/` becomes `_`, `+` becomes `-`); the final `=` padding may be kept or omitted. If a token matches a segment, the PHP endpoint returns contents of matching dot-prefixed files for that segment; otherwise the app loads the normal public files. Apache denies direct requests for dot-prefixed files in `data/`. The salt itself is never sent to the browser. If PHP or the environment variable is unavailable, the app logs the private-file lookup error and continues loading public files.
