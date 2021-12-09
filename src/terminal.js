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
  alive: 0,
  dead: 1
}

class Terminal {
  constructor (options) {
    this.terminal = _process(options)
    this.status = status.alive
    this.output = []

    this.registerEventHandlers()
  }

  write (string) {
    this.terminal.write(string)
  }

  kill () {
    this.terminal.kill('SIGTERM')
  }

  rows () {
    return this.terminal.rows
  }

  cols () {
    return this.terminal.cols
  }

  registerEventHandlers () {
    this.terminal.onData(data => {
      this.output.push(data.toString())
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