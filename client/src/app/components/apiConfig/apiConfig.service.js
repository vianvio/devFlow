angular.module('devCooperation')
  .factory('welcomeService', ['$http', '$q', 'Session', 'api', function($http, $q, Session, api) {
    var welcomeService = {};
    var apiRoute = api.isDev ? api.devRoute : api.proRoute;
    welcomeService.getProjectList = function() {
      var deferred = $q.defer();
      $http.get(apiRoute + '/projects?filter[include]=owner&filter[where][ownerId]=' + Session.currentUser().userId).then(function(res) {
        deferred.resolve(res.data);
      }, deferred.reject);

      return deferred.promise;
    };

    welcomeService.getSharedProjectList = function() {
      var deferred = $q.defer();
      $http.get(apiRoute + '/projectShares?filter[where][sharedUserId]=' + Session.currentUser().userId + '&filter[include][project]=owner').then(function(res) {
        deferred.resolve(res.data);
      }, deferred.reject);

      return deferred.promise;
    };

    return welcomeService;
  }]);
