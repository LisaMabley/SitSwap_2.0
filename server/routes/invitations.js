// Vendor imports
var express = require('express');
var pg = require('pg');

// Local imports
var connectionString = require('../db/connection').connectionString;

// Init router
var router = express.Router();

// Routes
router.get('/', function(request, response) {
  var coop_id = request.user.coop_id;

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to database');

    } else {
      var query = client.query('SELECT * FROM invitations WHERE coop_id = ' + coop_id + ';');

      var results = [];

      query.on('row', function(row) {
        results.push(row);
      });

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

router.post('/', function(request, response) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to database');

    } else {
      var query = client.query('INSERT INTO invitations (email, date, coop_id) VALUES ($1, $2, $3)', [request.body.email, new Date(), request.user.coop_id]);

      query.on('end', function() {
        response.redirect('/home');
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

router.delete('/', function(request, response) {
  pg.connect(connectionString, function(err, client, done) {
    if(err){
      console.log('Error connecting to database', err);
      response.sendStatus(500);

    } else {
      var query = client.query('DELETE FROM invitations WHERE id = $1', [request.body.invite_id]);

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
