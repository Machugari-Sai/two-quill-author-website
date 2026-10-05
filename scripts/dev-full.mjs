import { spawn } from 'node:child_process'
import net from 'node:net'
import { env, execPath } from 'node:process'

const root = process.cwd()
const apiPort = env.SAK_API_PORT || '8010'
const apiHost = env.SAK_API_HOST || '127.0.0.1'
function portIsBusy(port, host) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port: Number(port), host })
    socket.once('connect', () => { socket.destroy(); resolve(true) })
    socket.once('error', () => resolve(false))
  })
}

const children = [spawn(execPath, ['node_modules/vite/bin/vite.js'], {
    cwd: root,
    env,
    stdio: 'inherit',
  })]

if (!(await portIsBusy(apiPort, apiHost))) children.push(spawn(execPath, ['SAK_WEBSITE/server.js'], {
    cwd: root,
    env: { ...env, HOST: apiHost, PORT: apiPort },
    stdio: 'inherit',
  }))
else console.log(`Using the existing SAK API at http://${apiHost}:${apiPort}/`)

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
