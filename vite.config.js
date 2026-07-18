import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function copySakWebsite() {
  return {
    name: 'copy-sak-website',
    closeBundle() {
      const source = path.resolve('SAK_WEBSITE')
      const destination = path.resolve('dist/SAK_WEBSITE')
      fs.cpSync(source, destination, {
        recursive: true,
        filter: (entry) => !['.git', 'node_modules', 'users.json', 'sessions.json'].some((ignored) => entry.endsWith(path.sep + ignored) || entry.endsWith('/' + ignored)),
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), copySakWebsite()],
})
