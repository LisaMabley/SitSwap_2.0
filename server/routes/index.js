// Vendor imports
var router = require('express').Router();
var path = require('path');

// Local imports
var requestRouter = require('./requests');
var userRouter = require('./users');
var coopRouter = require('./coops');

// Index route
router.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/index2.html'));
});

// Direct specific calls to other routers
router.use('/requests', requestRouter);
router.use('/users', userRouter);
router.use('/coops', coopRouter);

module.exports = router;
