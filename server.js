const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const { Terminal } = require('./lib/terminal')

const stdout = data => io.emit('stdout', data)

const terminal = new Terminal(stdout)

io.on('connection', socket => {
  socket.on('stdin', data => {
    terminal.write(data)
  })

  
})

// Socket.io

// Terminal API
app.get('/terminal', (req, res) => {
  res.json({
      output: terminal.output,
      rows: terminal.rows(),
      cols: terminal.cols(),
      status: terminal.status
    })
})

app.post('/terminal', (req, res) => {
  try {
    terminal.write(req.query.cmd + '\r')
    res.end()
  } catch (e) {
    console.log(e)
    res.json({error: JSON.stringify(e)})
  }
})

// File Serving
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.use('/static', express.static('node_modules'));

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