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

// Index route
router.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/signin.html'));
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/home',
  // TODO: add failure message to display to user
  failureRedirect: '/'
  })
);

router.get('/logout', function(request, response){
  console.log('Called logout');
  request.logout();
  response.redirect('/');
});

// Direct specific calls to other routers
router.use('/requests', requestRouter);
router.use('/users', userRouter);
router.use('/coops', coopRouter);
router.use('/home', homeRouter);

module.exports = router;
