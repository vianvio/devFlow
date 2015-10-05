'use strict';

angular.module('devCooperation')
  .controller('uploadModalController', ['$scope', '$modalInstance', 'FileUploader', '$state', 'localStorageService',
    function($scope, $modalInstance, FileUploader, $state, localStorageService) {
      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

      var uploader = $scope.uploader = new FileUploader({
        scope: $scope, // to automatically update the html. Default: $rootScope
        url: '/api/containers/projectZip/upload',
        formData: [{
          projectId: $state.params.projectId
        }],
        headers: {
          'Authorization': localStorageService.get('current-user').tokenId
        }
      });

      uploader.onAfterAddingFile = function(item) {
        // console.info('After adding a file', item);
        if (uploader.queue.length > 1) {
          uploader.queue.splice(0, 1);
        }
      };

      $scope.close = function() {
        $modalInstance.close();
      }
    }
  ]);
