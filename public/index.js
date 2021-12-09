var term = new Terminal({
  windowOptions: {
    maximizeWin: 1,
    fullscreenWin: 1
  }
});
term.open(document.getElementById('terminal'));
var socket = io();
socket.on('stdout', data => {
  term.write(data)
})

socket.on('terminfo', data => {
  term.resize(data.cols, data.rows)
})

socket.onAny((event, ...args) => {  console.log(event, args);});

const writeToStdin = string => {
  socket.emit('stdin', string)
}

term.onKey(event => {
  writeToStdin(event.key)
})