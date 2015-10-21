'use strict';

angular.module('devCooperation')
  .controller('newProjectModalController', ['$scope', '$modalInstance', 'modalProjectService',
    function($scope, $modalInstance, modalProjectService) {
      $scope.showLoading = false;
      $scope.createFailed = false;
      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

      $scope.createProject = function() {
        $scope.newProjectForm.submitted = true;
        $scope.showLoading = true;
        if ($scope.newProjectForm.$valid) {
          modalProjectService.createProject($scope.newProjectObj).then(function(data) {
            // success
            if (!data.bError) {
              $modalInstance.close();
            } else {
              $scope.errorMsg = data.message;
              $scope.createFailed = true;
              $scope.showLoading = false;
            }
          }, function(e) {
            $scope.createFailed = true;
            $scope.showLoading = false;
          });
        } else {
          $scope.showLoading = false;
          $scope.createFailed = false;
        }
      }
    }
  ]);
