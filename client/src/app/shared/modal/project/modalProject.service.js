angular.module('devCooperation')
  .factory('modalProjectService', ['$http', '$q', 'api', function($http, $q, api) {
    var modalProjectService = {};
    var apiRoute = api.isDev ? api.devRoute : api.proRoute;

    modalProjectService.createProject = function(newProjectObj) {
      var deferred = $q.defer();

      $http.post(apiRoute + '/projects', newProjectObj).then(function(res) {
        deferred.resolve(res.data);
      }, function(res) {
        deferred.resolve(res.data.error);
      });

      return deferred.promise;
    };
    return modalProjectService;
  }]);
