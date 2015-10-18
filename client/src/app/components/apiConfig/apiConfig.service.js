angular.module('devCooperation')
  .factory('apiConfigService', ['$http', '$q', 'Session', 'api', function($http, $q, Session, api) {
    var apiConfigService = {};
    var apiRoute = api.isDev ? api.devRoute : api.proRoute;
    apiConfigService.getApiList = function(projectId) {
      var deferred = $q.defer();
      $http.get(apiRoute + '/apiConfigs?filter[include]=owner&filter[include]=lastUpdatedBy&filter[include]=apiMethod&filter[include]=apiFieldInfos&filter[where][projectId]=' + projectId).then(function(res) {
        deferred.resolve(res.data);
      }, deferred.reject);

      return deferred.promise;
    };

    apiConfigService.changeApiStatus = function(updatedApiConfigObj) {
      var deferred = $q.defer();
      $http.put(apiRoute + '/apiConfigs', updatedApiConfigObj).then(function(res) {
        deferred.resolve(res.data);
      }, deferred.reject);

      return deferred.promise;
    };

    apiConfigService.updateApiObj = function(updatedApiConfigObj) {
      var deferred = $q.defer();
      $http.put(apiRoute + '/apiConfigs', updatedApiConfigObj).then(function(res) {
        deferred.resolve(res.data);
      }, deferred.reject);

      return deferred.promise;
    };

    apiConfigService.updateApiFields = function(newFields) {
      var deferred = $q.defer();
      $http.post(apiRoute + '/apiFieldInfos', newFields).then(function(res) {
        deferred.resolve(res.data);
      }, function(res) {
        deferred.resolve(res.data.error);
      });

      return deferred.promise;
    };

    return apiConfigService;
  }]);
