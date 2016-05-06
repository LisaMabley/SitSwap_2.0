// Vendor imports
var path = require('path');

// Local imports
var router = require('express').Router();

// Routes
router.get('/*', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/index.html'));
});

module.exports = router;
