
// Vendor imports
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');

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

// Config: router
app.use('/', index);

// Config: db connection
dbConnection.initializeDB();

// Start server
app.listen(port, function() {
  console.log('Listening on port', port, ' --  Control + C to exit.');
});
