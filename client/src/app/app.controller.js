'use strict';

angular.module('devCooperation')
  .controller('ApplicationController', ['$scope', '$rootScope', 'AuthService', 'Session', '$window', 'localStorageService', function($scope, $rootScope, AuthService, Session, $window, localStorageService) {
    function initialize() {
      $scope.currentUser = Session.currentUser() || null;
      $scope.isLoggedIn = AuthService.isLoggedIn;
      $rootScope.showLoading = false;
    };

    $scope.setCurrentUser = function(user) {
      $rootScope.currentUser = user;
    }

    initialize();
    $window.onbeforeunload = function() {
      // $rootScope.currentUser = null;
      // localStorageService.remove('current-user');
    };

  }])
  .directive('includeReplace', function() {
    return {
      require: 'ngInclude',
      restrict: 'A',
      /* optional */
      link: function(scope, el, attrs) {
        el.replaceWith(el.children());
      }
    };
  });
