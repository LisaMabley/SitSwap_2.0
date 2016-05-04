// Vendor imports
var express = require('express');
var path = require('path');
var pg = require('pg');
var connectionString = require('../db/connection').connectionString;

// Init router
var router = express.Router();

// Routes
router.get('/', function(request, response) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to database.');

    } else {
      var query = client.query('SELECT * FROM requests INNER JOIN users ON requests.requestor_id = users.id WHERE requests.caregiver_id IS NULL;');
      var results = [];

      query.on('row', function(row) {
        results.push(row);
      })

      query.on('end', function() {
        console.log(results);
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

router.post('/add', function(request, response) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to database.');

    } else {
      var query = client.query('INSERT INTO requests (start_time, end_time, requestor_id, caregiver_id, comments) VALUES ($1, $2, $3, $4, $5)', [request.body.start_time, request.body.end_time, request.body.requestor_id, request.body.caregiver_id, request.body.comments]);

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
