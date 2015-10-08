angular.module('devCooperation')
  .controller('LoginController', ['$scope', '$rootScope', 'AUTH_EVENTS', 'AuthService', '$state', '$modal',
    function($scope, $rootScope, AUTH_EVENTS, AuthService, $state, $modal) {
      function initialize() {
        $scope.loginFailed = false;
        $scope.loginForm = {
          username: '',
          password: ''
        };
        $scope.showLoading = false;
      }

      initialize();

      $scope.login = function(credentials) {
        $scope.loginForm.submitted = true;
        $scope.showLoading = true;
        if ($scope.loginForm.$valid) {
          AuthService.login(credentials).then(function(user) {
            console.log(user);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $scope.setCurrentUser(user);
            $scope.showLoading = true;
            $state.go('welcome');
          }, function(e) {
            $scope.loginFailed = true;
            $scope.showLoading = false;
            $scope.loginErrorMessage = e.data.message;
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
          });
        } else {
          $scope.showLoading = false;
          $scope.loginFailed = false;
        }
      };

      $scope.register = function() {
        $scope.loginFailed = false;
        var modalInstance = $modal.open({
          templateUrl: "register.html",
          controller: "registerModalController",
          windowClass: "register-form"
        });


        modalInstance.result.then(function() {

        }, function() {

        });
      };
    }
  ]);
