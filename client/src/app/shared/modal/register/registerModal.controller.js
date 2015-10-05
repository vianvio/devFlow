'use strict';

angular.module('devCooperation').
controller('registerModalController', ['$scope', '$modalInstance', '$timeout', 'RegisterService',
  function($scope, $modalInstance, $timeout, RegisterService) {
    $scope.showLoading = false;
    $scope.createFailed = false;
    $scope.registerSuccess = false;
    $scope.bPwcAccount = true;
    $scope.newRegisterObj = {};
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

    $scope.changeAccountType = function(bPwcAccount) {
      $scope.bPwcAccount = bPwcAccount;
      // if (bPwcAccount) {
      //   angular.element('.modal-content').stop().animate({
      //     'marginTop': '-170px'
      //   }, 400);
      // } else {
      //   angular.element('.modal-content').stop().animate({
      //     'marginTop': '-303px'
      //   }, 400);
      // }
    };

    $scope.confirmPassword = function() {
      if($scope.newRegisterObj.confirmPassword != $scope.newRegisterObj.password) {
        $scope.createFailed = true;
        $scope.errorMsg = "Password not match"
      } else {
        $scope.createFailed = false;
      }
    }

    $scope.register = function() {
      $scope.registerForm.submitted = true;
      $scope.showLoading = true;
      console.log($scope.newRegisterObj);

      // var newRegisterObj = $scope.newRegisterObj;
      // delete newRegisterObj.confirmPassword;

      if ($scope.registerForm.$valid) {
        RegisterService.register($scope.newRegisterObj).then(function(res) {
          $scope.successMsg = res.message;
          $scope.registerSuccess = true;
          $timeout(function() {
            $scope.cancel();
          }, 1500);

        }, function(e) {
          console.log(e);
          $scope.errorMsg = e.data.message;
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
