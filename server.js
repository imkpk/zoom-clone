const express = require('express');
const app = express();
const server = require('http').Server(app);
const { v4: uuidV4 } = require('uuid');
const io = require('socket.io')(server);

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});
const port = 3020;
server.listen(port, () => {
  console.log(`app is listening on http://localhost:${port}`);
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    console.log(`socket is on`, roomId, userId);
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);
  });
});
