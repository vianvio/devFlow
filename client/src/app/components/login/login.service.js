angular.module('devCooperation')
  .factory('AuthService', ['$http', '$q', 'Session', 'api', 'socketService', function($http, $q, Session, api, socketService) {
    var authService = {};
    var apiRoute = api.isDev ? api.devRoute : api.proRoute;
    authService.login = function(credentials) {
      var deferred = $q.defer();
      $http.post(apiRoute + '/userModels/login', credentials).then(function(res) {
        Session.create(res.data.id, res.data.userId);
        $http.defaults.headers.common.Authorization = res.data.id;
        socketService.reconnect();
        deferred.resolve(res.data);
      }, deferred.reject);

      return deferred.promise;
    };

    authService.isLoggedIn = function() {
      return !!Session.currentUser();
    }

    authService.register = function(guid, accessCode) {
      var deferred = $q.defer();

      $http.post(apiRoute + '/registerPwcUser/', {
        userName: guid,
        accessCode: accessCode
      }).then(function(res) {
        deferred.resolve(res.data);
      }, deferred.reject);

      return deferred.promise;
    }

    return authService;
  }]);
