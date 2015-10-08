'use strict';

angular.module('devCooperation')
  .controller('addChatMemberModalController', ['$scope', '$modalInstance', 'addChatMemberService', '$state', 'localStorageService',
    function($scope, $modalInstance, addChatMemberService, $state, localStorageService) {
      $scope.showLoading = false;
      $scope.createFailed = false;

      var _initialize = function() {
        // get shared users
        $scope.arrUsers = [];
        $scope.arrSearchedUsers = [];
        addChatMemberService.getAddedMember(localStorageService.get('current-chat-room-id')).then(function(data) {
          data.forEach(function(userChatRoom) {
            $scope.arrUsers.push(userChatRoom.member);
          });
        });
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

      $scope.addUser = function() {
        $scope.addChatMemberForm.submitted = true;
        $scope.showLoading = true;
        // for now we need to format the industry id into array
        addChatMemberService.addChatMember($scope.shareUserObj.id, localStorageService.get('current-chat-room-id')).then(function(data) {
          // success
          if (!data.bError) {
            $scope.arrUsers.push($scope.shareUserObj);
          } else {
            $scope.errorMsg = data.message;
            $scope.createFailed = true;
            $scope.showLoading = false;
          }
        }, function(e) {
          $scope.createFailed = true;
          $scope.showLoading = false;
        });
      }

      $scope.searchUser = function() {
        // first time on focus will be undefined
        if ($scope.shareUserObj) {
          $scope.bShowSearchResult = true;
          $scope.bSearchable = false;
          $scope.createFailed = false;
          addChatMemberService.searchUser($scope.shareUserObj.username).then(function(data) {
            // check res's search text === current text
            if (data.searchText === $scope.shareUserObj.username) {
              $scope.arrSearchedUsers = data;
            }
          });
        }
      };

      $scope.chooseSearchedUser = function(searchedUser) {
        $scope.shareUserObj = searchedUser;
        $scope.bSearchable = true;
        $scope.bShowSearchResult = false;
        console.log(searchedUser);
      };

      $scope.close = function() {
        $modalInstance.close();
      }
      _initialize();
    }
  ]);
