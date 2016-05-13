// Imports
var app = angular.module('loginApp', []);

// Init controller
app.controller('LoginController', ['$http', function($http) {
  var controller = this;
  controller.showAlert = false;

  controller.sendLogin = function() {
    var sendData = {
      email: controller.email,
      password: controller.password
    }

    console.log(sendData);

    $http.post('/', sendData).then(function(response) {
      console.log(response);
      if (response.data == 'failure') {
        controller.showAlert = true;

      } else {
        window.location.href = '/home';
      }
    })
  }
}]);
