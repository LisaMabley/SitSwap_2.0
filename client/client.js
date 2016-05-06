// Imports
var app = angular.module('childcareApp', ['ngRoute']);

// Configure routes
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider

  // route for the open page
  .when('/', {
      templateUrl : 'views/open.html',
      controller  : 'OpenController',
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
      templateUrl : 'views/requests.html',
      controller  : 'RequestController',
      controllerAs : 'requests'
  });
  $locationProvider.html5Mode(true);
}]);

// Init angular controllers
app.controller('IndexController', ['$http', function($http) {
  var controller = this;

  controller.getUserInfo = function() {
    console.log('about to get user info');
    $http.get('/users/info').then(function(response) {
      console.log('got user info');
      controller.loggedInUser = response.data;
    });

  // controller.logout = function() {
  //   console.log('Client.js logging out');
  //   $http.get('/logout').then(function(response) {
  //   controller.loggedInUser = {};
  //   });
  // };

  controller.getUserInfo();
  }

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

app.controller('CommitmentController', function(){
});

app.controller('RequestController', function(){
});

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
