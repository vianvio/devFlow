angular.module('devCooperation')
  .factory('addChatMemberService', ['$http', '$q', 'api', 'Session',
    function($http, $q, api, Session) {
      var addChatMemberService = {};
      var apiRoute = api.isDev ? api.devRoute : api.proRoute;

      addChatMemberService.getAddedMember = function(chatRoomId) {
        var deferred = $q.defer();
        $http.get(apiRoute + '/userChatRooms?filter[where][chatRoomId]=' + chatRoomId + '&filter[include]=member').then(function(res) {
          deferred.resolve(res.data);
        }, function(res) {
          deferred.resolve(res.data.error);
        });

        return deferred.promise;
      };

      addChatMemberService.addChatMember = function(userId, chatRoomId) {
        var deferred = $q.defer();

        $http.post(apiRoute + '/userChatRooms', {
          chatRoomId: chatRoomId,
          memberId: userId
        }).then(function(res) {
          deferred.resolve(res.data);
        }, function(res) {
          deferred.resolve(res.data.error);
        });

        return deferred.promise;
      };

      addChatMemberService.searchUser = function(searchText) {
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

      return addChatMemberService;
    }
  ]);
