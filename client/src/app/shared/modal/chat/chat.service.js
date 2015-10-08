angular.module('devCooperation')
  .factory('chatService', ['$http', '$q', 'api', function($http, $q, api) {
    var chatService = {};
    var apiRoute = api.isDev ? api.devRoute : api.proRoute;

    chatService.getChatRoomsByOwner = function(userId) {
      var deferred = $q.defer();
      $http.get(apiRoute + '/chatRooms?filter[where][ownerId]=' + userId).then(function(res) {
        console.log(res);
        deferred.resolve(res.data);
      }, deferred.reject);

      return deferred.promise;
    };

    chatService.getChatRoomsByMember = function(memberId) {
      var deferred = $q.defer();
      $http.get(apiRoute + '/userChatRooms?filter[where][memberId]=' + memberId + '&filter[include]=chatRoom').then(function(res) {
        console.log(res);
        deferred.resolve(res.data);
      }, deferred.reject);

      return deferred.promise;
    };

    return chatService;
  }]);
