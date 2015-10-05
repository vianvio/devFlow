'use strict';

angular.module('devCooperation')
  .controller('confirmModalController', ['$scope', '$modalInstance', '$state', 'confirmModalService',
    function($scope, $modalInstance, $state, confirmModalService) {
      $scope.showLoading = false;
      $scope.confirmEvent = function() {
        $scope.showLoading = true;
        confirmModalService.actionDo($scope.paramData, $scope.confirmUrl).then(function(data) {
          if (data.status == 'true') {
            $modalInstance.close();
            $scope.showLoading = false;
          } else {
            $scope.showLoading = false;
          }
        });
      }
      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    }
  ]);