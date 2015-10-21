angular.module('devCooperation')
  .factory('newFileService', ['$http', '$q', 'api', function($http, $q, api) {
    var newFileService = {};
    var apiRoute = api.isDev ? api.devRoute : api.proRoute;

    newFileService.getApiMethodList = function() {
      var deferred = $q.defer();
      $http.get(apiRoute + '/apiMethods').then(function(res) {
        deferred.resolve(res.data);
      }, deferred.reject);

      return deferred.promise;
    };

    newFileService.createApi = function(apiConfigObj) {
      var deferred = $q.defer();
      $http.post(apiRoute + '/apiConfigs', apiConfigObj).then(function(res) {
        console.log(res);
        deferred.resolve(res.data);
      }, deferred.reject);

      return deferred.promise;
    };
    return newFileService;
  }]);
