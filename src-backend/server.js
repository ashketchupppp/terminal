const express = require('express')

const { Terminal } = require('./terminal')

const app = express();
const port = 3001

const terminals = []
terminals.push(new Terminal())

/*
make an API thats like this
  /terminals -> list of terminals
    /terminals/:termNo -> basic info about a terminal
      /terminals/:termNo/out -> stream of terminals output
      /terminals/:termNo/in -> stream of terminals output

https://www.npmjs.com/package/socket.io
  const app = require('express')();
  const server = require('http').createServer(app);
  const io = require('socket.io')(server);
  io.on('connection', () => { });
  server.listen(3000);

do this ^^^ to setup the streaming 
frontend will display whatever is received from the backend
frontend will put whatever keypresses is recieves onto the socket

fucking genius
*/

app.get('/terminals', (req, res) => {
  res.json(terminals.map(terminal => {
    return {
      output: terminal.output,
      rows: terminal.rows(),
      cols: terminal.cols(),
      status: terminal.status
    }
  }))
})

app.get('/terminals/:terminalNumber', (req, res) => {
  try {
    res.send(terminals[req.params.terminalNumber].output)
  } catch (e) {
    console.log(e)
    res.json({error: JSON.stringify(e)})
  }
})

app.post('/terminals/:terminalNumber', (req, res) => {
  try {
    terminals[req.params.terminalNumber].execute(req.query.cmd)
    res.end()
  } catch (e) {
    console.log(e)
    res.json({error: JSON.stringify(e)})
  }
})
 

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

process.on('exit', () => {
  for (terminal in terminals) {
    terminal.kill()
  }
})