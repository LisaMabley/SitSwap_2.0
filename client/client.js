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

  // route for the open requests page
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
  })

  // route for the coop page
  .when('/coop', {
      templateUrl : 'views/coop.html',
      controller  : 'CoopController',
      controllerAs : 'coop'
  });

  $locationProvider.html5Mode(true);
}]);

// Init angular controllers
app.controller('IndexController', ['$http', function($http) {
  var controller = this;

  controller.getUserInfo = function() {
    $http.get('/users/info').then(function(response) {
      controller.loggedInUser = response.data;
    });

    $http.get('/coops/name').then(function(response) {
      console.log(response.data[0]);
      controller.loggedInUser.coopName = response.data[0].name;
    })
  }

  controller.getUserInfo();
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

app.controller('CoopController', ['$http', function($http) {
  var controller = this;
  controller.memberList = [];

  controller.getMembers = function() {
    $http.get('/users/coop').then(function(response) {
      console.log(response.data);
      controller.memberList = response.data;
    });
  }

  controller.getMembers();
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
