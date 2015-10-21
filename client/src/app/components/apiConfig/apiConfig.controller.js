'use strict';

angular.module('devCooperation').controller('apiConfigCtrl', ['$scope', '$rootScope', '$modal', '$state', 'apiConfigService', 'localStorageService',
  function($scope, $rootScope, $modal, $state, apiConfigService, localStorageService) {
    var initialize = function() {
      $scope.arrApis = [];
      $scope.apiFileFilter = '';
      $scope.projectName = localStorageService.get('currentProjectInfo').projectName;
      apiConfigService.getApiList(localStorageService.get('currentProjectInfo').projectId).then(function(data) {
        console.log(data);
        data.forEach(function(obj) {
          if (obj.urlWithParams) {
            obj.arrParams = obj.urlWithParams.match(/{\w+}/gi);
            obj.bShowParams = true;
          }
          if (obj.apiFieldInfos) {
            obj.apiResultSuccessFieldInfos = [];
            obj.apiResultFailFieldInfos = [];
            obj.apiSendFieldInfos = [];
            obj.apiFieldInfos.forEach(function(field) {
              delete field.apiConfigId;
              delete field.createdAt;
              delete field.updatedAt;
              delete field.id;
              if (field.fieldInfoType === 'resultSuccess') {
                delete field.fieldInfoType;
                obj.apiResultSuccessFieldInfos.push(field);
              } else if (field.fieldInfoType === 'resultFail') {
                delete field.fieldInfoType;
                obj.apiResultFailFieldInfos.push(field);
              } else if (field.fieldInfoType === 'send') {
                delete field.fieldInfoType;
                obj.apiSendFieldInfos.push(field);
              }
            });
            obj.expectedResultSuccessJson = JSON.stringify(obj.apiResultSuccessFieldInfos, null, '\t');
            obj.expectedResultFailJson = JSON.stringify(obj.apiResultFailFieldInfos, null, '\t');
            obj.expectedSendJson = JSON.stringify(obj.apiSendFieldInfos, null, '\t');
          }
        });
        $scope.arrApis = data;
      });
    };

    $scope.pageTo = function(routeName) {
      $state.go(routeName, {
        projectId: localStorageService.get('currentProjectInfo').projectId
      });
    };

    $scope.getApiHolderColor = function(api) {
      var _result = '';
      if (api.isExpand) {
        _result = 'api-holder-expand';
      } else if (api.isDisabled) {
        _result = 'api-holder-disabled';
      }
      return _result;
    };

    $scope.createAPI = function() {
      var modalInstance = $modal.open({
        templateUrl: "new-api.html",
        controller: "newApiModalController",
        windowClass: "new-api-form"
      });


      modalInstance.result.then(function() {
        initialize();
      }, function() {

      });
    };

    initialize();
  }
]);
// only can show the json. but cannot bind together
// .filter('formatACEString', function($filter) {
//   return function(apiFieldInfos, apiIndex) {
//     apiFieldInfos.forEach(function(field) {
//       delete field.apiConfigId;
//       delete field.createdAt;
//       delete field.updatedAt;
//       delete field.id;
//       delete field.isTypeOpen;
//     });
//     return JSON.stringify(apiFieldInfos, null, '\t');
//   }
// });
