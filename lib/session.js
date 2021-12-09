const sessions = {}

class Session {
  constructor (socket, terminal) {
    this.id = socket.handshake.auth.sessionID
    this.socket = socket
    this.terminal = terminal
    sessions[this.id] = this

    this.socket.emit('terminfo', {
      rows: this.terminal.rows(),
      cols: this.terminal.cols(),
      id: this.terminal.id
    })

    this.socket.on('stdin', data => {
      this.terminal.write(data)
    })
  
    this.socket.on('disconnect', data => {
      this.kill()
    })
  }

  kill () {
    this.terminal.kill()
  }
}

module.exports = {
  sessions,
  Session
}