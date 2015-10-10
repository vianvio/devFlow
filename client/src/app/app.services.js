angular.module('devCooperation')
  .factory('socketService', ['$http', '$q', 'Session', 'api', '$rootScope', function($http, $q, Session, api, $rootScope) {
    var apiRoute = api.isDev ? api.devRoute : api.proRoute;
    var socketService = {};
    //Creating connection with server
    // var _socket = io.connect('http://172.31.61.55:3000');
    var _socket = io.connect('http://localhost:3000');
    var _eventMethods = {};

    socketService.connect = function() {
      //This part is only for login users for authenticated _socket connection between client and server.
      var userInfo = Session.currentUser();
      if (userInfo) {
        var id = userInfo.tokenId;
        var userId = userInfo.userId;
        _socket = {};
        // _socket = io.connect('http://172.31.61.55:3000', {
        _socket = io.connect('http://localhost:3000', {
          'force new connection': true
        });
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

    socketService.getSocket = function() {
      return _socket;
    };

    socketService.setEventMethod = function(eventName, fncName, fnc) {
      if (!_eventMethods[fncName]) {
        _eventMethods[fncName] = fnc;
        _socket.on(eventName, fnc);
      }
    };

    socketService.connect();

    /* namespace version. Have error: always disconnect when open the chat room
    var _sockets = {}; // save all the sockets
    var _eventMethods = {};

    socketService.connect = function(namespace, cb, eventName, eventMethodName) {
      console.log(namespace);
      //This part is only for login users for authenticated _socket connection between client and server.
      var userInfo = Session.currentUser();
      if (userInfo) {
        var id = userInfo.tokenId;
        var userId = userInfo.userId;
        var _socket = io.connect('http://172.31.61.55:3000/' + (namespace !== 'main' ? namespace : ''), {
          'force new connection': namespace === 'main'
        });
        _socket.on('connect', function() {
          _socket.emit('authentication', {
            id: id,
            userId: userId
          });
          _socket.on('authenticated', function() {
            // use the _socket as usual
            console.log('User is authenticated');
            // push to array, use namespace as key
            _sockets[namespace] = _socket;
          });

          if (cb) cb(_socket);

          // TODO: could be array
          if (eventName && eventMethodName) {
            _socket.on(eventName, _eventMethods[eventMethodName]);
          }
        });
      }
    };

    socketService.getSocket = function(namespace) {
      console.log(_sockets);
      return _sockets[namespace];
    };

    socketService.disconnectAll = function() {
      for (var key in _sockets) {
        _sockets[key].disconnect();
      };
    };

    socketService.setEventMethod = function(fncName, fnc) {
      if (!_eventMethods.fncName) {
        _eventMethods[fncName] = fnc;
      }
    };

    socketService.connect('main');
     */

    return socketService;
  }]);
