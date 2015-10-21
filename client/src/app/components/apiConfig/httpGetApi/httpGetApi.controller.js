'use strict';

angular.module('devCooperation').
controller('httpGetApiCtrl', ['$scope', '$rootScope', '$modal', '$state', 'apiConfigService', 'localStorageService',
  function($scope, $rootScope, $modal, $state, apiConfigService, localStorageService) {
    $scope.init = function(api, apiIndex) {
      $scope.api = api;
      $scope.apiIndex = apiIndex;
    }
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

    $scope.changeApiStatus = function(isDisabled) {
      apiConfigService.changeApiStatus({
        id: $scope.api.id,
        isDisabled: isDisabled
      }).then(function(data) {
        $scope.api.isDisabled = data.isDisabled;
        $scope.api.updatedAt = data.updatedAt;
      });
    };

    $scope.expandHolder = function() {
      $scope.api.isExpand = true;
      angular.element('#holder-' + $scope.api.id).stop().animate({
        height: '490px'
      }, 300);
    };

    $scope.collapseHolder = function() {
      $scope.api.isExpand = false;
      angular.element('#holder-' + $scope.api.id).stop().animate({
        height: '130px'
      }, 300);
    };

    $scope.addNewField = function() {
      if ($scope.api.apiResultSuccessFieldInfos) {
        $scope.api.apiResultSuccessFieldInfos.push({});
      } else {
        $scope.api.apiResultSuccessFieldInfos = [{
          name: 'id',
          type: 'Row Number' // first field, default to row number. ==> id in db
        }];
      }
    };

    $scope.getParams = function() {
      $scope.api.arrParams = $scope.api.urlWithParams.match(/{\w+}/gi);
    };

    $scope.saveApiDetail = function() {
      var _apiObjStatus = false,
        _newFieldStatus = false;
      // format the api obj
      var _updateAPIObj = {
        id: $scope.api.id,
        urlWithParams: $scope.api.urlWithParams,
        succeededResRoute: $scope.api.succeededResRoute,
        failedResRoute: $scope.api.failedResRoute
      };
      apiConfigService.updateApiObj(_updateAPIObj).then(function(data) {
        _apiObjStatus = true;
        if (_newFieldStatus) $scope.collapseHolder();
        $scope.api.updatedAt = data.updatedAt; // only update the date, others are the same
      });
      // always delete all the fields and create new ones.
      // will also create sample data
      var _newFields = [];
      // for get, only apiResultSuccessFieldInfos
      $scope.api.apiResultSuccessFieldInfos.forEach(function(field) {
        if (field.name) {
          delete field.isTypeOpen;
          field.fieldInfoType = 'resultSuccess';
          field.apiConfigId = $scope.api.id;
          if (field.type === 'JSON Array') {
            field.minItems = parseInt(field.minItems);
            field.maxItems = parseInt(field.maxItems);
          }
          _newFields.push(field);
        }
      });
      apiConfigService.updateApiFields(_newFields).then(function(data) {
        _newFieldStatus = true;
        if (_apiObjStatus) $scope.collapseHolder();
      });
    };
  }
]);
