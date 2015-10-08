'use strict';

angular.module('devCooperation').
controller('chatModalController', ['$scope', '$modalInstance', '$timeout', 'chatService', '$modal', 'Session', 'localStorageService', 'socketService',
  function($scope, $modalInstance, $timeout, chatService, $modal, Session, localStorageService, socketService) {
    $scope.showLoading = false;
    $scope.newRegisterObj = {};

    var _initialize = function() {
      $scope.arrRooms = [];
      $scope.arrSharedRooms = [];
      socketService.setEventMethod('chat message', 'afterGetChatMessage', function(message) {
        // add chat message
        console.log(message);
        var messageObj = JSON.parse(message);
        var _holder = angular.element('#' + messageObj.roomId + ' .chat-content-list');
        _holder.append("<div class='chat-content-line pull-left'><div class='chat-content pull-left'><div class='chat-content-user'>" + messageObj.username + "</div><div class='chat-content-text'>" + messageObj.message + "</div></div></div>");
        _holder.scrollTop(_holder.prop('scrollHeight'));
      });

      chatService.getChatRoomsByOwner(Session.currentUser().userId).then(function(data) {
        $scope.arrRooms = data;
        // create chat room socket
        data.forEach(function(room) {
          socketService.getSocket().emit('join room', room.id);
        });
      });

      chatService.getChatRoomsByMember(Session.currentUser().userId).then(function(data) {
        data.forEach(function(userChatRoom) {
          $scope.arrSharedRooms.push(userChatRoom.chatRoom);
          socketService.getSocket().emit('join room', userChatRoom.chatRoom.id);
        });
      });
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

    $scope.setCurrentRoom = function(roomId) {
      $scope.currentRoomId = roomId;
      localStorageService.remove('current-chat-room-id');
      localStorageService.set('current-chat-room-id', roomId);
    };

    $scope.addChatRoom = function() {
      var modalInstance = $modal.open({
        templateUrl: "add-chat-room.html",
        controller: "addChatRoomModalController",
        windowClass: "add-chat-room-form"
      });


      modalInstance.result.then(function() {
        _initialize();
      }, function() {

      });
    };

    $scope.addChatMember = function() {
      var modalInstance = $modal.open({
        templateUrl: "add-chat-member.html",
        controller: "addChatMemberModalController",
        windowClass: "add-chat-member-form"
      });


      modalInstance.result.then(function() {
        // add member info
      }, function() {

      });
    };

    $scope.sendMessage = function(event) {
      if (event.keyCode === 13) {
        // send message
        socketService.getSocket().emit('chat message', JSON.stringify({
          username: Session.currentUser().username,
          message: event.target.value,
          roomId: localStorageService.get('current-chat-room-id')
        }));
        event.target.value = '';
      }
    };

    _initialize();
  }
]);
