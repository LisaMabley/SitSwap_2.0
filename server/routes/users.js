// Vendor imports
var express = require('express');
var path = require('path');
var pg = require('pg');
var connectionString = require('../db/connection').connectionString;

// Init router
var router = express.Router();

// Routes
router.post('/add', function(request, response) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to database.');

    } else {
      var user = {
        first_name: request.body.first_name,
        last_name: request.body.last_name,
        phone: request.body.phone,
        email: request.body.email,
        coop_id: request.body.coop_id
      }

      var query = client.query('INSERT INTO users (first_name, last_name, phone, email, coop_id) VALUES ($1, $2, $3, $4, $5)', [user.first_name, user.last_name, user.phone, user.email, user.coop_id]);

      query.on('end', function() {
        response.sendStatus(200);
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
