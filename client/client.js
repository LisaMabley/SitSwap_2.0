// Imports
var app = angular.module('childcareApp', ['ngRoute']);

// Configure routes
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider

  // route for the open page
  .when('/', {
      templateUrl : 'views/index.html',
      controller  : 'IndexController',
      controllerAs : 'open'
  })

  .when('/open', {
      templateUrl : 'views/open.html',
      controller  : 'OpenController',
      controllerAs : 'open'
  })

  // route for the commitments page
  .when('/commitments', {
      templateUrl : 'views/commitments.html',
      controller  : 'CommitmentController',
      controllerAs : 'commitments'
  })

  // route for the requests page
  .when('/requests', {
      templateUrl : 'views/myrequests.html',
      controller  : 'RequestController',
      controllerAs : 'requests'
  });
  $locationProvider.html5Mode(true);
}]);

// Init angular controllers
app.controller('IndexController', ['$http', function($http) {
  var controller = this;

  // Test data
  // TODO: get for real
  var loggedInUser = {
    id: 19,
    first_name: 'Lisa',
    last_name: 'Mabley',
    phone: '1234567890',
    email: 'q@w',
    coop_id: 6
  }

  // Not working
  // controller.getUserInfo = function() {
  //   $http.get('/users/info').then(function(response) {
  //     controller.loggedInUser = response.data;
  //   });
  // }

//   controller.careRequest = {
//     start_time: new Date("May 6, 2016 10:30:00"),
//     end_time: new Date("May 6, 2016 2:00:00"),
//     requestor_id: 8,
//     caregiver_id: 7,
//     comments: 'Mana still has the sniffles, will probably just want to read in bed'
//   }
}]);

app.controller('OpenController', ['$http', function($http) {
  var controller = this;
  controller.requestList = [];

  controller.getOpenRequests = function() {
    $http.get('/requests/open').then(function(response) {
      controller.requestList = addDisplayDates(response.data);
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
  }

  controller.getOpenRequests();
}]);

app.controller('CommitmentController', ['$http', function($http) {
  var controller = this;
  controller.requestList = [];

  controller.getCommitments = function() {
    $http.get('/requests/committed').then(function(response) {
      controller.requestList = addDisplayDates(response.data);
    });
  }

  controller.markComplete = function(request_id) {
    $.ajax({
      method: 'put',
      url: '/requests/complete',
      data: {
        request_id: request_id
        }

    }).done(function(response) {
      controller.getCommitments();
    });
  }

  controller.getCommitments();
}]);

app.controller('RequestController', ['$http', function($http) {
  var controller = this;
  controller.requestList = [];

  controller.getMyRequests = function() {
    $http.get('/requests/mine').then(function(response) {
      controller.requestList = addDisplayDates(response.data);
    });
  }

  controller.cancel = function(request_id) {
    $.ajax({
      method: 'delete',
      url: '/requests/delete',
      data: {
        request_id: request_id
        }

    }).done(function(response) {
      controller.getMyRequests();
    });
  }

  controller.getMyRequests();
}]);

  // Init controller functions
  // controller.addCoop = function() {
  //   $http.post('/coops/add', controller.coop);
  // }
  //
  // controller.addRequest = function() {
  //   $http.post('/requests/add', controller.careRequest);
  // }

function addDisplayDates(requestList) {
  var formatString = 'dddd, MMMM D, h:mm a';
  for (var i = 0; i < requestList.length; i++) {
    requestList[i].startDisplay = moment(requestList[i].start_time).format(formatString);
    requestList[i].endDisplay = moment(requestList[i].end_time).format(formatString);
  }
  return (requestList);
};
