// Vendor imports
var express = require('express');
var pg = require('pg');
var passport = require('passport');

// Local imports
var connectionString = require('../db/connection').connectionString;
var encryptLibrary = require('../../modules/encryption');

// Init router
var router = express.Router();

// Routes
router.get('/info', function(request, response) {
  response.send(request.user);
});

router.get('/coop', function(request, response) {
  var coopId = request.user.coop_id;

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to database.');

    } else {

      var query = client.query('SELECT first_name, last_name, phone, email ' +
        'FROM users ' +
        'INNER JOIN coops ' +
        'ON users.coop_id = coops.id ' +
        'WHERE coops.id = ' + coopId + ';');

      var results = [];

      query.on('row', function(row) {
        results.push(row);
      })

      query.on('end', function() {
        response.send(results);
        done();
      });

      query.on('error', function(err) {
        console.log('Error running query', err);
        response.sendStatus(500);
        done();
      });
    }
  });
});

router.post('/', function(request, response, next) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to database.');

    } else {
      var user = {
        first_name: request.body.first_name,
        last_name: request.body.last_name,
        phone: request.body.phone,
        email: request.body.email,
        coop_id: 6, // TODO: make this work sometime
        password: encryptLibrary.encryptPassword(request.body.password)
      }

      var query = client.query(
        'INSERT INTO users (first_name, last_name, phone, email, coop_id, password) ' +
        ' VALUES ($1, $2, $3, $4, $5, $6)', [user.first_name, user.last_name, user.phone, user.email, user.coop_id, user.password]);

      query.on('end', function() {
        var authFunction = passport.authenticate('local', {
          successRedirect: '/success',
          failureRedirect: '/failure'
        });
        authFunction(request, response, next);
        done();
      });

      query.on('error', function(err) {
        console.log('Error running query', err);
        response.sendStatus(500);
        done();
      });
    }
  });
});

module.exports = router;
