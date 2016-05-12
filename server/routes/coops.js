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

// Routes
router.post('/addSampleData', function(request, response) {

  var coopNames = ['Elim Church Families', 'Logan Park Neighborhood Co-op', 'Webster School ECFE Coop'];

  for (var i = 0; i < coopNames.length; i++) {
    
    pg.connect(connectionString, function(err, client, done) {
      if (err) {
        console.log('Error connecting to database.');

      } else {
        var query = client.query('INSERT INTO coops (name) VALUES ($1)', coopNames[i]);

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
  }
});

router.get('/name', function(request, response) {
  var coopId = request.user.coop_id;
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to database.');

    } else {
      var query = client.query('SELECT name FROM coops WHERE id = ' + coopId + ';');

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

module.exports = router;
