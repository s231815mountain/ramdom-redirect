const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = 3000;
const MAX_PLAYERS = 4;
const REDIRECT_URLS = [
  'https://www.google.com',
  'https://www.yahoo.com',
  'https://www.bing.com',
  'https://www.pornhub.com' // 実際には適切なリダイレクト先に変更してください
];

let playerCount = 0;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  playerCount++;
  io.emit('playerCount', playerCount);

  if (playerCount <= MAX_PLAYERS) {
    socket.emit('redirect', REDIRECT_URLS[playerCount - 1]);
  }

  socket.on('disconnect', () => {
    playerCount--;
    io.emit('playerCount', playerCount);
  });
});

http.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
