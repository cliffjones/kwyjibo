import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import packageJson from './package.json' with { type: 'json' }

const base = new URL(packageJson.homepage).pathname.replace(/\/?$/, '/')

const apacheSpaFallback = {
  name: 'apache-spa-fallback',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: '.htaccess',
      source: [
        'Options -Indexes',
        'DirectoryIndex index.html',
        'RewriteEngine On',
        `RewriteBase ${base}`,
        'RewriteRule ^data/?$ index.html [L]',
        'RewriteCond %{REQUEST_FILENAME} -f',
        'RewriteRule ^data/[^/]+\\.k$ - [L]',
        'RewriteRule ^data/ - [F,L]',
        'RewriteCond %{REQUEST_FILENAME} -f',
        'RewriteRule ^ - [L]',
        'RewriteRule ^ index.html [L]'
      ].join('\n')
    })
  }
}

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), apacheSpaFallback],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.ts',
    include: ['src/**/*.test.ts?(x)'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.tsx'],
      exclude: ['src/**/*.test.tsx', 'src/main.tsx']
    }
  }
})
