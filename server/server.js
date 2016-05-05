
// Vendor imports
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var localStrategy = require('passport-local');
var session = require('express-session');
var pg = require('pg');

// Local Imports
var dbConnection = require('./db/connection');

// Init express
var app = express();
var port = process.env.PORT || 3000;

// Import router
var index = require('./routes/index');

// Config: middleware
app.use(express.static('server/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: 'garden',
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 600000, secure: false}
}));

// Init passport
app.use(passport.initialize());
app.use(passport.session());

// Passport setup
passport.use('local', new localStrategy({
  passReqToCallback: true,
  usernameField: 'username'
},

function(request, email, password, done) {
  console.log('Called local');

  pg.connect(dbConnection.connectionString, function(err, client) {
    console.log('Called local - PG');
    var user = {};
    var query = client.query('SELECT * FROM users WHERE email = $1', [email]);

    query.on('row', function(row) {
      console.log('User obj', row);
      console.log('User pw', password);

      user = row;

      if (password == user.password) {
        console.log('Email and password match');
        done(null, user);

      } else {
        console.log('Incorrect email or password');
        done(null, false, {message: 'Incorrect email or password.'});
      }
    });

    // Handle errors in meaningful way
    if (err) {
      console.log(err);
      }
    });
  }
));

// Config: router
app.use('/', index);

// Config: db connection
dbConnection.initializeDB();

// Start server
app.listen(port, function() {
  console.log('Listening on port', port, ' --  Control + C to exit.');
});
