import fs from 'node:fs'
import path from 'node:path'
import { env } from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const sakApiTarget = env.SAK_API_URL || 'http://127.0.0.1:8010'
const frontendPort = Number(env.SAK_FRONTEND_PORT) || 5173

function copySakWebsite() {
  const sakSource = path.resolve('SAK_WEBSITE')
  const sakUrlRoot = '/SAK_WEBSITE'
  const contentTypes = {
    '.gif': 'image/gif',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
  }
  const ignoredNames = new Set([
    ".git",
    ".agents",
    ".codex",
    ".vscode",
    "node_modules",
    "users.json",
    "sessions.json",
    "reviews.json",
    "comic-ratings.json",
  ])

  return {
    name: 'copy-sak-website',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const requestPath = (request.url || '').split('?')[0]
        let decodedPath
        try {
          decodedPath = decodeURIComponent(requestPath)
        } catch {
          return next()
        }
        if (!decodedPath.startsWith(`${sakUrlRoot}/`)) return next()
        const filePath = path.resolve(sakSource, `.${decodedPath.slice(sakUrlRoot.length)}`)
        if (filePath !== sakSource && !filePath.startsWith(`${sakSource}${path.sep}`)) return next()
        if (!contentTypes[path.extname(filePath).toLowerCase()] || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return next()
        response.statusCode = 200
        response.setHeader('Content-Type', contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream')
        fs.createReadStream(filePath).on('error', next).pipe(response)
      })
    },
    closeBundle() {
      const destination = path.resolve('dist/SAK_WEBSITE')
      fs.cpSync(sakSource, destination, {
        recursive: true,
        filter: (entry) => {
          const name = path.basename(entry)
          return !ignoredNames.has(name) && !name.endsWith('.log')
        },
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), copySakWebsite()],
  server: {
    host: '127.0.0.1',
    port: frontendPort,
    proxy: {
      '/api': {
        target: sakApiTarget,
        changeOrigin: false,
      },
    },
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
  },
})
