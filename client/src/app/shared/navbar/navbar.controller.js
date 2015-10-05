'use strict';

angular.module('devCooperation')
  .controller('navbarCtrl', ['$scope', '$rootScope', 'Session', '$state', '$location', function($scope, $rootScope, Session, $state, $location) {
    // $scope.logout = function() {
    //   Session.destroy();
    //   $scope.currentUser = null;
    //   $state.go('login');
    // }
    $scope.currentTabIndex = 0;
    $scope.showSignoutPanel = false;

    $scope.getHighlightedTab = function(tabIndex) {
      return $scope.currentTabIndex === tabIndex ? 'nav-tab-highlight' : '';
    }
    $scope.turnToHomePage = function() {
      if (Session.currentUser()) {
        $state.go('welcome');
      } else {
        $state.go('login');
      }
    };

    $scope.logout = function() {
      $location.path('/logout');
    };

    $scope.showSignoutMenu = function() {
      $scope.showSignoutPanel = !$scope.showSignoutPanel;
    }

    $(document).bind('click', function(event) {
      var isClickedElementChildOfPopup = (($("#logout-container")
        .find(event.target)
        .length > 0) || ($("#logout-container").attr('id') == $(event.target).attr('id')));

      if (!isClickedElementChildOfPopup) {
        $scope.$apply(function() {
          $scope.showSignoutPanel = false;
        });
      }
    });

  }]);
