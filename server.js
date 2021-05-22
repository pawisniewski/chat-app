const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.use((req, res) => {
  res.status(404).send('Not found...');
});

const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.on('join', (login) => {
    console.log('Client is logged in as ' + login);
    socket.broadcast.emit('message', { author: 'Chat Bot', content: login + ' has joined the conversation!' });
    users.push({ login, id: socket.id });
    console.log('All users:', users);
  });

  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    socket.broadcast.emit('message', message);
    messages.push(message);
    console.log('All messages:', messages);
  });

  socket.on('disconnect', () => {
    const i = users.findIndex(user => user.id === socket.id);
    
    if (i >= 0) {
      console.log('Oh, socket ' + socket.id + ' has left')
      socket.broadcast.emit('message', { author: 'Chat Bot', content: users[i].login + ' has left the conversation... :(' });
      users.splice(i, 1);
      console.log('All users:', users);
    };

  });

  console.log('I\'ve added a listener on message event \n');
});
