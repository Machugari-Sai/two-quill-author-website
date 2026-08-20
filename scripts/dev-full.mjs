import { spawn } from 'node:child_process'
import { env, execPath } from 'node:process'

const root = process.cwd()
const apiPort = env.SAK_API_PORT || '8010'
const apiHost = env.SAK_API_HOST || '127.0.0.1'
const children = [
  spawn(execPath, ['node_modules/vite/bin/vite.js'], {
    cwd: root,
    env,
    stdio: 'inherit',
  }),
  spawn(execPath, ['SAK_WEBSITE/server.js'], {
    cwd: root,
    env: { ...env, HOST: apiHost, PORT: apiPort },
    stdio: 'inherit',
  }),
]

let shuttingDown = false
const shutdown = (code = 0) => {
  if (shuttingDown) return
  shuttingDown = true
  children.forEach((child) => child.kill('SIGTERM'))
  setTimeout(() => process.exit(code), 250)
}

children.forEach((child) => {
  child.on('exit', (code, signal) => {
    if (!shuttingDown && (code !== 0 || signal)) shutdown(code || 1)
  })
})

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))
