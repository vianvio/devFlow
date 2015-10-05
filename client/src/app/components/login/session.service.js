angular.module('devCooperation')
  .service('Session', ['localStorageService', '$base64', '$http', function(localStorageService, $base64, $http) {
    var Session = {};
    Session.create = function(tokenId, userId) {
      localStorageService.set('current-user', {
        "tokenId": tokenId,
        "userId": userId
      });
    };

    Session.destroy = function() {
      localStorageService.remove('current-user');
    };

    Session.currentUser = function() {
      return localStorageService.get('current-user');
    }

    return Session;
  }]);
