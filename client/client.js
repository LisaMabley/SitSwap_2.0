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
    first_name: 'Suzanna',
    last_name: 'Altman',
    phone: '612-517-3409',
    email: 'suzannaaltman@gmail.com',
    coop_id: 6
  }
  controller.careRequest = {
    start_time: new Date("May 13, 2016 15:15:00"),
    end_time: new Date("May 13, 2016 18:45:00"),
    requestor_id: 8,
    caregiver_id: 7,
    comments: 'Posey will be away at a slumber party. We will be back by Henry\'s bedtime'
  }

  // Init controller functions
  controller.addCoop = function() {
    $http.post('/coops/add', controller.coop);
  }

  controller.addUser = function() {
    $http.post('/users/add', controller.user);
  }

  // controller.addRequest = function() {
  controller.test = function() {
    $http.post('/requests/add', controller.careRequest);
  }

  // controller.getRequests = function() {
  //   controller.request = {};
  //   $http.get('/requests/getAll').then(function(response) {
  //     controller.requestList = response.data;
  //   });
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
