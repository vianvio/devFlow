angular.module('devCooperation')
  .factory('confirmModalService', ['$http', '$q', 'api', function($http, $q, api) {
    var confirmModalService = {};
    var apiRoute = api.isDev ? api.devRoute : api.proRoute;

    confirmModalService.actionDo = function(paramObject,url) {
      var deferred = $q.defer();
      $http.post(apiRoute + url, paramObject).then(function(res) {
        deferred.resolve(res.data);
      }, deferred.reject);

      return deferred.promise;
    };
    return confirmModalService;
  }]);