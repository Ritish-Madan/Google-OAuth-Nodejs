const express = require('express');
const path = require('path');
// Google's OAuth2 client
// Including our config file
const CONFIG = require('./config/config');
// Databse Config
const db = require('./config/mongoose');
// Creating our express application
const app = express();
// express sessions
const session = require('express-session')

// Mongo sessions
const mongoStore = require('connect-mongo')(session);

// Allowing ourselves to use cookies
const cookieParser = require('cookie-parser');


// Setting up EJS Views
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
// Access the statics file
app.use(express.static(path.join(__dirname, '/public')));

// Using cookieParser middleware for the cookie management
app.use(cookieParser());

app.use(session({
  name: 'auth',
  saveUninitialized: false,
  secret: 'ritish',
  cookie:{
    maxAge: 1000000
  },
  store: new mongoStore({
    mongooseConnection: db,
    autoRemove: 'disable'
  })
}))

app.use('/',require('./routes/index'));
// Listen on the port defined in the config file
app.listen(CONFIG.port, function () {
  console.log(`Listening on port ${CONFIG.port}`);
});