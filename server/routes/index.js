// Vendor imports
var passport = require('passport');
var path = require('path');
var pg = require('pg');

var router = require('express').Router();

// Local imports
var requestRouter = require('./requests');
var userRouter = require('./users');
var coopRouter = require('./coops');
var homeRouter = require('./home');
var inviteRouter = require('./invitations');

// Index route
router.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/signin.html'));
});

router.get('/failure', function(request, response) {
  response.send('failure');
});

router.get('/success', function(request, response) {
  response.send('success');
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/success',
  failureRedirect: '/failure'
  })
);

router.get('/logout', function(request, response){
  request.logout();
  response.redirect('/'); // This doesn't work
});

// Direct specific calls to other routers
router.use('/requests', requestRouter);
router.use('/users', userRouter);
router.use('/coops', coopRouter);
router.use('/home', homeRouter);
router.use('/invitations', inviteRouter);

module.exports = router;
