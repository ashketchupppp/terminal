const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const { Session, sessions } = require('./lib/session')
const { Terminal } = require('./lib/terminal')

// Socket.io
io.on('connection', async socket => {
  const onDataHandler = data => socket.emit('stdout', data)
  const terminal = new Terminal(onDataHandler)
  new Session(socket, terminal)
})

// Terminal API
app.get('/sessions', (req, res) => {
  res.json(Object.keys(sessions).map(id => {
    return sessions[id].id
  }))
})

// File Serving
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.use('/static', express.static('node_modules'));
app.use('/public', express.static('public'));

const port = 3000
server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// Make sure we kill background processes before we leave
process.on('exit', () => {
  for (terminal in terminals) {
    terminal.kill()
  }
})