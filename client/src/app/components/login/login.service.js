angular.module('devCooperation')
  .factory('AuthService', ['$http', '$q', 'Session', 'api', 'socketService', function($http, $q, Session, api, socketService) {
    var authService = {};
    var apiRoute = api.isDev ? api.devRoute : api.proRoute;
    authService.login = function(credentials) {
      var deferred = $q.defer();
      $http.post(apiRoute + '/userModels/login', credentials).then(function(res) {
        Session.create(res.data.id, res.data.userId, res.data.username);
        $http.defaults.headers.common.Authorization = res.data.id;

        socketService.connect();
        /* namespace version 
        // after login, connect the main socket
        socketService.connect('main', function(_socket) {
          _socket.on('child socket created', function(strChildInfo) {
            var objChildInfo = JSON.parse(strChildInfo);
            console.log(objChildInfo);
            socketService.connect(objChildInfo.childNamespace, function(_socket) {}, objChildInfo.eventName, objChildInfo.eventMethodName);
          });
        });
        */
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
