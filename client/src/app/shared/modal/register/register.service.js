angular.module('devCooperation')
  .factory('RegisterService', ['$http', '$q', 'api', function($http, $q, api) {
    var registerService = {};
    var apiRoute = api.isDev ? api.devRoute : api.proRoute;

    registerService.register = function(registerObj) {
      var deferred = $q.defer();
      $http.post(apiRoute + '/userModels', registerObj).then(function(res) {
        console.log(res);
        deferred.resolve(res.data);
      }, deferred.reject);

      return deferred.promise;
    };
    return registerService;
  }]);
