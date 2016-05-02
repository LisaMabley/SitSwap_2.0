// Vendor imports
var express = require('express');
var path = require('path');
var pg = require('pg');
var connectionString = require('../db/connection').connectionString;

// Init router
var router = express.Router();

// Routes
router.post('/add', function(request, response) {
  console.log('Coop router post route', request.body);
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to database.');

    } else {
      var query = client.query('INSERT INTO coops (name) VALUES ($1)', [request.body.name]);

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
