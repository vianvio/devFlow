'use strict';

angular.module('devCooperation').
controller('addChatRoomModalController', ['$scope', '$modalInstance', '$timeout', 'addChatRoomService',
  function($scope, $modalInstance, $timeout, addChatRoomService) {
    $scope.showLoading = false;
    $scope.createFailed = false;
    $scope.createSuccess = false;
    $scope.newChatRoomObj = {};
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

    $scope.addRoom = function() {
      $scope.addChatRoomForm.submitted = true;
      $scope.showLoading = true;

      if ($scope.addChatRoomForm.$valid) {
        addChatRoomService.addRoom($scope.newChatRoomObj).then(function(res) {
          $scope.successMsg = res.message;
          $scope.createSuccess = true;
          $timeout(function() {
            $modalInstance.close();
          }, 1500);

        }, function(e) {
          $scope.errorMsg = e.data.error.message;
          $scope.showLoading = false;
          $scope.createFailed = true;
        });
      } else {
        $scope.showLoading = false;
        $scope.createFailed = false;
      }
    }
  }
]);
