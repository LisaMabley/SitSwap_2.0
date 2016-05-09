// Vendor imports
var express = require('express');
var path = require('path');
var pg = require('pg');
var connectionString = require('../db/connection').connectionString;

// Init router
var router = express.Router();

// Test data
var userId =

// Routes
router.get('/open', function(request, response) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to database.');

    } else {
      // TODO: this pulls ALL open requests. Need to refine for just user's coop and exclude or highlight user's own requests
      var query = client.query(
      'SELECT requests.id, requests.start_time, requests.end_time, requests.comments, users.first_name, users.last_name ' +
      'FROM requests ' +
      'LEFT JOIN users ' +
      'ON requests.requestor_id = users.id ' +
      'WHERE requests.caregiver_id IS NULL AND ' +
      'requests.completed = false AND ' +
      'requests.requestor_id != ' + request.user.id +';'
    );

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

router.get('/committed', function(request, response) {
  var userId = request.user.id;
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to database.');

    } else {
      var query = client.query(
        'SELECT requests.id, requests.start_time, requests.end_time, requests.comments, users.first_name, users.last_name ' +
        'FROM requests ' +
        'INNER JOIN users ' +
        'ON requests.requestor_id = users.id ' +
        'WHERE requests.completed = false AND ' +
        'requests.caregiver_id = ' + userId + ';');

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

router.get('/mine', function(request, response) {
  var userId = request.user.id;
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to database.');

    } else {
      var query = client.query(
        'SELECT requests.id, requests.start_time, requests.end_time, requests.comments, users.first_name, users.last_name ' +
        'FROM requests ' +
        'LEFT JOIN users ' +
        'ON requests.caregiver_id = users.id ' +
        'WHERE requests.completed = false AND ' +
        'requests.requestor_id = ' + userId + ';');

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
      var query = client.query(
        'INSERT INTO requests (start_time, end_time, requestor_id, comments) ' +
        'VALUES ($1, $2, $3, $4)',
        [request.body.start_time, request.body.end_time, request.user.id, request.body.comments]);

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

router.put('/assign', function(request, response) {
  pg.connect(connectionString, function(err, client, done) {
    if(err){
      console.log('Error connecting to database', err);
      response.sendStatus(500);

    } else {
      var query = client.query('UPDATE requests SET caregiver_id = $1 WHERE id = $2', [request.user.id, request.body.request_id]);

      query.on('end', function() {
        response.sendStatus(200);
        done();
      })

      query.on('error', function(err) {
        console.log('Error running query', err);
        response.redirect('500');
        done();
      });
    }
  });
});

router.put('/complete', function(request, response) {
  pg.connect(connectionString, function(err, client, done) {
    if(err){
      console.log('Error connecting to database', err);
      response.sendStatus(500);

    } else {
      var query = client.query('UPDATE requests SET completed = true WHERE id = ' + request.body.request_id + ';');

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

router.delete('/delete', function(request, response) {
  pg.connect(connectionString, function(err, client, done) {
    if(err){
      console.log('Error connecting to database', err);
      response.sendStatus(500);

    } else {
      var query = client.query('DELETE FROM requests WHERE id = $1', [request.body.request_id]);

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
