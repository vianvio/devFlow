'use strict';

angular.module('devCooperation')
  .controller('navbarCtrl', ['$scope', '$rootScope', 'Session', '$state', '$location', '$modal',
    function($scope, $rootScope, Session, $state, $location, $modal) {
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

      $scope.showChat = function() {
        var modalInstance = $modal.open({
          templateUrl: "chat.html",
          controller: "chatModalController",
          windowClass: "chat-form"
        });


        modalInstance.result.then(function() {

        }, function() {

        });
      };

    }
  ]);
