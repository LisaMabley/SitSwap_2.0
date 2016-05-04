// Vendor imports
var express = require('express');
var path = require('path');
var pg = require('pg');
var connectionString = require('../db/connection').connectionString;

// Init router
var router = express.Router();

// Routes
router.get('/open', function(request, response) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to database.');

    } else {
      var query = client.query('SELECT requests.id, requests.start_time, requests.end_time, requests.comments, users.first_name, users.last_name FROM requests INNER JOIN users ON requests.requestor_id = users.id WHERE requests.caregiver_id IS NULL;');
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

router.put('/assign', function(request, response) {
  pg.connect(connectionString, function(err, client, done) {
    if(err){
      console.log('Error connecting to database', err);
      response.sendStatus(500);

    } else {
      var query = client.query('UPDATE requests SET caregiver_id = $1 WHERE id = $2', [request.body.user_id, request.body.request_id]);

      query.on('end', function() {
        response.sendStatus(200);
        done();
      })

      query.on('error', function(err) {
        console.log('Error running query', err);
        response.sendStatus(500);
        done();
      });
    }
  });
});

module.exports = router;
