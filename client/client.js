// Imports
var app = angular.module('childcareApp', []);

// Init angular controllers
app.controller('MainController', ['$http', function($http) {
  var controller = this;

  // Init controller variables
  controller.requestList = [];
  controller.request = {};
  controller.coop = {name: 'Webster School ECFE'};
  controller.user = {
    id: 8,
    first_name: 'Suzanna',
    last_name: 'Altman',
    phone: '612-517-3409',
    email: 'suzannaaltman@gmail.com',
    coop_id: 6
  }
  controller.careRequest = {
    start_time: new Date("May 6, 2016 10:30:00"),
    end_time: new Date("May 6, 2016 2:00:00"),
    requestor_id: 8,
    caregiver_id: 7,
    comments: 'Mana still has the sniffles, will probably just want to read in bed'
  }

  // Init controller functions
  controller.addCoop = function() {
    $http.post('/coops/add', controller.coop);
  }

  controller.addUser = function() {
    $http.post('/users/add', controller.user);
  }

  controller.addRequest = function() {
    $http.post('/requests/add', controller.careRequest);
  }

  controller.getOpenRequests = function() {
    $http.get('/requests').then(function(response) {
      controller.requestList = response.data;
      addDisplayDates();
    });
  }

  controller.assignRequest = function(request_id) {
    $.ajax({
      method: 'put',
      url: '/requests/assign',
      data: {
        request_id: request_id,
        user_id: controller.user.id
      }
    }).done(function(response) {
      controller.getOpenRequests();
    });
  // }
}

  function addDisplayDates() {
    var formatString = 'dddd, MMMM D, h:mm a';
    for (var i = 0; i < controller.requestList.length; i++) {
      controller.requestList[i].startDisplay = moment(controller.requestList[i].start_time).format(formatString);
      controller.requestList[i].endDisplay = moment(controller.requestList[i].end_time).format(formatString);
    }
  };

  controller.getOpenRequests();
  //
  // controller.cancelRequest = function(request) {
  // }
  //
  // controller.updateRequest = function(request) {
  // }
  //
  // controller.getRequests();
}]);
