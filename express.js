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
const RateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./lib/logger');

const PORT = process.env.PORT || 8080;

const server = express();

server.use(helmet());

server.use(express.json({limit: '300kb'})); // body-parser defaults to a body size limit of 100kb

server.use(fileUpload({
  createParentPath: true
}));
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
server.enable('trust proxy');
const {mongoURI: db} = keys;

let app;

async function start() {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    app = server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}. Use our API`);
    });
  } catch (e) {
    console.log(e);
  }
}

// passport middleware
server.use(passport.initialize());

// cors
const allowedOrigins = ['http://localhost:3000'];
server.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// HTTP request logger
if (process.env.NODE_ENV !== 'production') {
  server.use(logger.devLogger);
}
server.use(logger.errorLogger);

passportConfig(passport);

const apiLimiter = new RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// API Routes
server.use('/api/user', apiLimiter, user);
server.use("/api/news", news);

server.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../dist", "index.html"));
});

start();

// const io = require("socket.io").listen(app);
//
// const users = {}; // все пользователи чата
//
// io.sockets.on('connection', socket => {
//   let updateUsers = () => {
//     let usersRoom = [];
//     for (let i in users) {
//       usersRoom.push(users[i].name);
//     }
//     return usersRoom;
//   };
//
//   socket.on('adduser', username => {
//     users[socket.id] = {};
//     users[socket.id].name = username || 'Guest';
//     users[socket.id].id = socket.id;
//
//     let newUsers = updateUsers();
//       socket.emit('updateusers', newUsers);
//       socket
//         .broadcast
//         .emit('updateusers', newUsers);
//   });
//
//   socket.on('message', data => {
//     socket.json.emit('updatechat', {
//       name: users[socket.id].name,
//       msg: data
//     });
//     socket.broadcast.json.emit('updatechat', {
//       name: users[socket.id].name,
//       msg: data
//     });
//   });
//
//   socket.on('disconnect', data => {
//     socket.broadcast.json.emit('updatechat', {
//       name: 'System',
//       msg: `${users[socket.id].name} покинул чат`
//     });
//     delete users[socket.id];
//     socket.broadcast.emit('updateusers', updateUsers());
//   });
// });
