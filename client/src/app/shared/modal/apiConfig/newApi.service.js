angular.module('devCooperation')
  .factory('newApiService', ['$http', '$q', 'api', function($http, $q, api) {
    var newApiService = {};
    var apiRoute = api.isDev ? api.devRoute : api.proRoute;

    newApiService.getApiMethodList = function() {
      var deferred = $q.defer();
      $http.get(apiRoute + '/apiMethods').then(function(res) {
        deferred.resolve(res.data);
      }, deferred.reject);

      return deferred.promise;
    };

    newApiService.createApi = function(apiConfigObj) {
      var deferred = $q.defer();
      $http.post(apiRoute + '/apiConfigs', apiConfigObj).then(function(res) {
        console.log(res);
        deferred.resolve(res.data);
      }, deferred.reject);

      return deferred.promise;
    };
    return newApiService;
  }]);
