const os = require('os')
const pty = require('node-pty');

const shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash'

const _process = options => 
  pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env,
    ...options
  })


const status = {
  alive: 'alive',
  dead: 'dead'
}

class Terminal {
  constructor (onDataHandler, procOptions) {
    this.terminal = _process(procOptions)
    this.status = status.alive

    this.registerEventHandlers(onDataHandler)
  }

  write (string) {
    this.terminal.write(string)
  }

  kill () {
    this.terminal.kill()
  }

  rows () {
    return this.terminal.rows
  }

  cols () {
    return this.terminal.cols
  }

  registerEventHandlers (onDataHandler) {
    this.terminal.onData(data => {
      onDataHandler(data)
    })

    this.terminal.onExit((code, signal) => {
      console.log('child process exited with ' + `code ${code} and signal ${signal}`)
      this.status = status.dead
    })
  }
}

module.exports = {
  Terminal
}