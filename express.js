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
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
const {mongoURI: db} = keys;

async function start() {
  try {
    await mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true});
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}. Use our API`);
    })
  } catch (e) {
    console.log(e);
  }
}

// passport middleware
server.use(passport.initialize())

passportConfig(passport)

// API Routes
server.use('/api/user', user);
server.use('/api/news', news);


server.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../dist', 'index.html'))
});

start();
