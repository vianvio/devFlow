'use strict';

angular.module('devCooperation')
  .controller('inviteModalController', ['$scope', '$modalInstance', 'inviteService',
    function($scope, $modalInstance, inviteService) {
      $scope.createFailed = false;
      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
      $scope.hostuser = {
        name: 'baron zhu',
        account: 'host000',
        power: 'ssss'
      };

      inviteService.getInvitedUserInfoList().then(function(data) {
        $scope.inviters = data;

      }, function(e) {

      });
      $scope.addInviteUser = function() {
        if (!$scope.accountNum) {
          $scope.createFailed = true;
          $scope.errorMsg = 'Please fill out this field';
          return;
        }
        for (var i = 0; i < $scope.inviters.length; i++) {
          if ($scope.inviters[i].account == $scope.accountNum) {
            $scope.createFailed = true;
            $scope.errorMsg = 'This inviter is already exists';
            return;
          }
        }
        $scope.createFailed = false;
        inviteService.addInvitedUsers($scope.accountNum).then(function(data) {
          // if(data.flag = false){

          // }else{
          //    $scope.createFailed = true;
          //    $scope.errorMsg = 'This inviter is not exists';
          //    return;
          // }
          $scope.inviters = data;
          $scope.accountNum = '';

        }, function(e) {

        });

      };

      $scope.removeInvitedUser = function(removeInfo) {
        //   inviteService.removeInvitedUser(removeInfo).then(function(data){
        //   $scope.users = data;
        // }
        // ,function(e){

        // });
        var tempArray = [];
        for (var i = 0; i < inviteService.testData.length; i++) {
          if (inviteService.testData[i].account != removeInfo) {
            tempArray[tempArray.length] = inviteService.testData[i];
          }
        }
        inviteService.testData = tempArray;
        $scope.inviters = tempArray;
      }

    }
  ]);