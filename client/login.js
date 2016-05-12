// Imports
var app = angular.module('loginApp', ['ui.bootstrap']);

// Init controller
app.controller('LoginController', ['$http', function($http) {
  var controller = this;

  controller.generateSampleCoopData = function() {
    $http.post('/coops/addSampleData');
  }

  // if () {
  //   controller.loginFailureAlert = {};
  //
  // } else {
  //
  // }
}]);
