'use strict';

angular.module('devCooperation')
  .controller('shareProjectModalController', ['$scope', '$modalInstance', 'modalShareProjectService', '$state',
    function($scope, $modalInstance, modalShareProjectService, $state) {
      $scope.showLoading = false;
      $scope.createFailed = false;

      var _initialize = function() {
        // get shared users
        $scope.arrUsers = [];
        $scope.arrSearchedUsers = [];
        modalShareProjectService.getSharedUsers($state.params.projectId).then(function(data) {
          data.forEach(function(projectShare) {
            $scope.arrUsers.push(projectShare.sharedUser);
          });
        });
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

      $scope.addUser = function() {
        $scope.shareProjectForm.submitted = true;
        $scope.showLoading = true;
        // for now we need to format the industry id into array
        modalShareProjectService.addSharedUser($scope.shareUserObj.id, $state.params.projectId).then(function(data) {
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
          modalShareProjectService.searchUser($scope.shareUserObj.username).then(function(data) {
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
