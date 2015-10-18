'use strict';

angular.module('devCooperation').controller('apiConfigCtrl', ['$scope', '$rootScope', '$modal', '$state', 'apiConfigService', 'localStorageService',
  function($scope, $rootScope, $modal, $state, apiConfigService, localStorageService) {
    $scope.editorMode = {
      mode: 'json'
    };
    $scope.arrFieldType = [
      'Boolean',
      'City',
      'Country',
      'Company Name',
      'Country Code',
      'Currency',
      'Custom List',
      'Date',
      'Domain Name',
      'Email Address',
      'First Name',
      'Full Name',
      'Gender',
      'Given Name (Chinese)',
      'GUID',
      'IP Address v4',
      'Job Title',
      'JSON Array',
      'Language',
      'Last Name',
      'Latitude',
      'Longitude',
      'Number',
      'Paragraphs',
      'Phone',
      'Row Number'
    ];
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
            obj.apiFieldInfos.forEach(function(field) {
              delete field.apiConfigId;
              delete field.createdAt;
              delete field.updatedAt;
              delete field.id;
            });
            obj.expectedResultJson = JSON.stringify(obj.apiFieldInfos, null, '\t');
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

    $scope.changeApiStatus = function(apiIndex, isDisabled) {
      apiConfigService.changeApiStatus({
        id: $scope.arrApis[apiIndex].id,
        isDisabled: isDisabled
      }).then(function(data) {
        $scope.arrApis[apiIndex].isDisabled = data.isDisabled;
        $scope.arrApis[apiIndex].updatedAt = data.updatedAt;
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

    $scope.expandHolder = function(apiIndex) {
      $scope.arrApis[apiIndex].isExpand = true;
      angular.element('#holder-' + $scope.arrApis[apiIndex].id).stop().animate({
        height: '490px'
      }, 300);
    };

    $scope.collapseHolder = function(apiIndex) {
      $scope.arrApis[apiIndex].isExpand = false;
      angular.element('#holder-' + $scope.arrApis[apiIndex].id).stop().animate({
        height: '130px'
      }, 300);
    };

    $scope.addNewField = function(apiIndex) {
      if ($scope.arrApis[apiIndex].apiFieldInfos) {
        $scope.arrApis[apiIndex].apiFieldInfos.push({});
      } else {
        $scope.arrApis[apiIndex].apiFieldInfos = [{
          name: 'id',
          type: 'Row Number' // first field, default to row number. ==> id in db
        }];
      }
      // console.log($scope.arrApis[apiIndex]);
      // TODO: format to json and display in editor

    };

    $scope.getParams = function(apiIndex) {
      $scope.arrApis[apiIndex].arrParams = $scope.arrApis[apiIndex].urlWithParams.match(/{\w+}/gi);
    };

    $scope.saveApiDetail = function(api, apiIndex) {
      var _apiObjStatus = false,
        _newFieldStatus = false;
      // format the api obj
      var _updateAPIObj = {
        id: api.id,
        urlWithParams: api.urlWithParams,
        succeededResRoute: api.succeededResRoute,
        failedResRoute: api.failedResRoute
      };
      apiConfigService.updateApiObj(_updateAPIObj).then(function(data) {
        _apiObjStatus = true;
        if (_newFieldStatus) $scope.collapseHolder(apiIndex);
        $scope.arrApis[apiIndex].updatedAt = data.updatedAt; // only update the date, others are the same
      });
      // always delete all the fields and create new ones.
      // will also create sample data
      var _newFields = [];
      api.apiFieldInfos.forEach(function(field) {
        if (field.name) {
          delete field.isTypeOpen;
          field.apiConfigId = api.id;
          if (field.type === 'JSON Array') {
            field.minItems = parseInt(field.minItems);
            field.maxItems = parseInt(field.maxItems);
          }
          _newFields.push(field);
        }
      });
      apiConfigService.updateApiFields(_newFields).then(function(data) {
        _newFieldStatus = true;
        if (_apiObjStatus) $scope.collapseHolder(apiIndex);
      });
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
