const path = require('path');
const keys = require('./config/keys');
const passportConfig = require('./config/passport');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const user = require('./routes/user');
const news = require('./routes/news');
const fileUpload = require('express-fileupload');

const PORT = process.env.PORT || 8080;

const server = express();

// Body parser middleware (for post requests handling )
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
const { mongoURI: db } = keys;

async function start() {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}. Use our API`);
    });
  } catch (e) {
    console.log(e);
  }
}

// passport middleware
server.use(passport.initialize());

passportConfig(passport);

// API Routes
server.use('/api/user', user);
server.use('/api/news', news);

server.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../dist', 'index.html'));
});

start();

const io = require('socket.io').listen(server);

const users = {}; // все пользователи чата

io.sockets.on('connection', socket => {
  // функция вовзращает массив пользователей, кто находится в комнате room
  let updateUsers = () => {
    // здесь будет список пользователей в комнате room
    let usersRoom = [];
    for (let i in users) {
      // в цикле проходим всех пользователей и пушим в массив
      usersRoom.push(users[i].name);
    }
    return usersRoom;
  };

  // событие наступает когда пользователь впервые заходит в чат
  socket.on('adduser', username => {
    // создадим объект пользователя
    users[socket.id] = {};
    // присвоем ему его имя или по умолчанию Гость
    users[socket.id].name = username || 'Guest';

    let newUsers = updateUsers();
      // сообщаем пользователю список пользователей в комнате
      socket.emit('updateusers', newUsers);
      // сообщаем всем в комнате, что список пользоватлей поменялся
      socket
        .broadcast
        .emit('updateusers', newUsers);
  });

  // обрабатываем событие когда пользователь, что-то написал в чат
  socket.on('message', data => {
    // возвращаем пользователю то, что он написал обратно
    socket.json.emit('updatechat', {
      name: users[socket.id].name,
      msg: data
    });
    // сообщаем всем пользователям комнаты, что написал пользователь
    socket.broadcast.json.emit('updatechat', {
      name: users[socket.id].name,
      msg: data
    });
  });

  socket.on('disconnect', data => {
    // сообащем в комнату, что пользователь ушел с чата
    socket.broadcast.json.emit('updatechat', {
      name: 'System',
      msg: `${users[socket.id].name} покинул чат`
    });
    // удаляем пользователя
    delete users[socket.id];
    // в команте обновляем список пользователей на клиенте
    socket.broadcast.emit('updateusers', updateUsers());
  });
});
