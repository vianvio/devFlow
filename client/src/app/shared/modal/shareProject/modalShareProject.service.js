angular.module('devCooperation')
  .factory('modalShareProjectService', ['$http', '$q', 'api', 'Session', function($http, $q, api, Session) {
    var modalShareProjectService = {};
    var apiRoute = api.isDev ? api.devRoute : api.proRoute;

    modalShareProjectService.getSharedUsers = function(projectId) {
      var deferred = $q.defer();

      $http.get(apiRoute + '/projectShares?filter[where][projectId]=' + projectId + '&filter[include]=sharedUser').then(function(res) {
        console.log(res);
        deferred.resolve(res.data);
      }, function(res) {
        deferred.resolve(res.data.error);
      });

      return deferred.promise;
    };

    modalShareProjectService.addSharedUser = function(userId, projectId) {
      var deferred = $q.defer();

      $http.post(apiRoute + '/projectShares', {
        projectId: projectId,
        sharedUserId: userId
      }).then(function(res) {
        deferred.resolve(res.data);
      }, function(res) {
        deferred.resolve(res.data.error);
      });

      return deferred.promise;
    };

    modalShareProjectService.searchUser = function(searchText) {
      var deferred = $q.defer();

      $http.get(apiRoute + '/userModels?filter[where][id][neq]=' + Session.currentUser().userId + '&filter[where][username][like]=.*' + searchText + '.*').
      then(function(res) {
        res.data.searchText = searchText;
        deferred.resolve(res.data);
      }, function(res) {
        deferred.resolve(res.data.error);
      });

      return deferred.promise;
    };

    return modalShareProjectService;
  }]);
