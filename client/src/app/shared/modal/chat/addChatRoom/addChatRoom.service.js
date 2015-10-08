angular.module('devCooperation')
  .factory('addChatRoomService', ['$http', '$q', 'api', function($http, $q, api) {
    var addChatRoomService = {};
    var apiRoute = api.isDev ? api.devRoute : api.proRoute;

    addChatRoomService.addRoom = function(newRoomObj) {
      var deferred = $q.defer();
      $http.post(apiRoute + '/chatRooms', newRoomObj).then(function(res) {
        deferred.resolve(res.data);
      }, deferred.reject);

      return deferred.promise;
    };
    return addChatRoomService;
  }]);
