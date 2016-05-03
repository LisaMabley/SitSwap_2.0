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
      var query = client.query('INSERT INTO requests (start, stop, requestor_id, caregiver_id, comments) VALUES ($1, $2, $3, $4, $5)', [request.body.start, request.body.end, request.body.requestor_id, request.body.caregiver_id, request.body.comments]);

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
