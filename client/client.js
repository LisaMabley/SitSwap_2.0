// Imports
var app = angular.module('childcareApp', []);

// Init angular controllers
app.controller('MainController', ['$http', function($http) {
  var controller = this;

  // Init controller variables
  // controller.requestList = [];
  // controller.request = {};
  controller.coop = {name: 'Webster School ECFE'};
  controller.user = {
    first_name: 'Ryan',
    last_name: 'Mulcahy',
    phone: '612-288-1103',
    email: 'ryanmulcahy@gmail.com',
    coop_id: 4
  }

  // Init controller functions
  controller.addCoop = function() {
    $http.post('/coops/add', controller.coop);
  }

  // controller.addUser = function() {
  controller.test = function() {
    $http.post('/users/add', controller.user);
  }

  // controller.getRequests = function() {
  //   controller.request = {};
  //   $http.get('/requests/getAll').then(function(response) {
  //     controller.requestList = response.data;
  //   });
  // }
  //
  // controller.addRequest = function() {
  //   $http.post('/requests/add', controller.request).then(controller.getRequests());
  // }
  //
  // controller.cancelRequest = function(request) {
  // }
  //
  // controller.updateRequest = function(request) {
  // }
  //
  // controller.getRequests();
}]);
