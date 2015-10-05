angular.module('devCooperation')
  .factory('socketService', ['$http', '$q', 'Session', 'api', '$rootScope', function($http, $q, Session, api, $rootScope) {
    var apiRoute = api.isDev ? api.devRoute : api.proRoute;
    var socketService = {};
    //Creating connection with server
    var _socket = io.connect('http://localhost:3000');

    var _initSocket = function() {
      //This part is only for login users for authenticated _socket connection between client and server.
      var userInfo = Session.currentUser();
      if (userInfo) {
        var id = userInfo.tokenId;
        var userId = userInfo.userId;
        _socket.on('connect', function() {
          _socket.emit('authentication', {
            id: id,
            userId: userId
          });
          _socket.on('authenticated', function() {
            // use the _socket as usual
            console.log('User is authenticated');
          });
        });
      }
    };

    socketService.reconnect = function() {
      // reconnect
      _socket = io.connect('http://localhost:3000', {
        'force new connection': true
      });
      _initSocket();
    };

    socketService.disconnect = function() {
      _socket.disconnect();
    };

    socketService.getSocket = function() {
      return _socket;
    };

    _initSocket();

    return socketService;
  }]);
