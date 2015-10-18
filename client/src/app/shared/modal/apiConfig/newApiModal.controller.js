'use strict';

angular.module('devCooperation').
controller('newApiModalController', ['$scope', '$modalInstance', '$timeout', 'newApiService', '$state',
  function($scope, $modalInstance, $timeout, newApiService, $state) {
    var initialize = function() {
      $scope.showLoading = false;
      $scope.createFailed = false;
      $scope.createSuccess = false;
      $scope.apiMethodChosen = '';
      $scope.status = {
        isopen: false
      };
      $scope.newApiObj = {
        projectId: $state.params.projectId
      };
      newApiService.getApiMethodList().then(function(data) {
        $scope.arrApiMethods = data;
        $scope.apiMethodChosen = data[0].name;
        $scope.newApiObj.apiMethodId = data[0].id;
      });
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

    $scope.chooseApiMethod = function(apiMethodObj) {
      $scope.apiMethodChosen = apiMethodObj.name;
      $scope.newApiObj.apiMethodId = apiMethodObj.id;
    };

    $scope.create = function() {
      $scope.newApiForm.submitted = true;
      $scope.showLoading = true;
      console.log($scope.newApiObj);

      // var newApiObj = $scope.newApiObj;
      // delete newApiObj.confirmPassword;

      if ($scope.newApiForm.$valid) {
        newApiService.createApi($scope.newApiObj).then(function(res) {
          $scope.successMsg = res.message;
          $scope.createSuccess = true;
          $timeout(function() {
            $modalInstance.close();
          }, 1500);

        }, function(e) {
          console.log(e);
          $scope.errorMsg = e.data.error.message;
          $scope.showLoading = false;
          $scope.createFailed = true;
        });
      } else {
        $scope.showLoading = false;
        $scope.createFailed = false;
      }
    };

    initialize();
  }
]);
