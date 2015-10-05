angular.module('devCooperation')
  .factory('inviteService', ['$http', '$q', 'api', function($http, $q, api) {
    var inviteService = {};
    var apiRoute = api.isDev ? api.devRoute : api.proRoute;
    //tests
    inviteService.testData = [{
      name: 'bzhu',
      account: 'bzhu001',
      power: 'ssss'
    }, {
      name: 'bzhu',
      account: 'bzhu002',
      power: 'ssss'
    }, {
      name: 'bzhu',
      account: 'bzhu003',
      power: 'ssss'
    }, {
      name: 'bzhu',
      account: 'bzhu004',
      power: 'ssss'
    }, {
      name: 'bzhu',
      account: 'bzhu005',
      power: 'ssss'
    }, {
      name: 'bzhu',
      account: 'bzhu006',
      power: 'ssss'
    }];
    //teste
    inviteService.addInvitedUsers = function(userInfo) {
      var deferred = $q.defer();
      //tests
      var testobj = {
        name: 'bzhu',
        account: userInfo,
        power: 'ssss'
      };
      inviteService.testData.push(testobj);
      deferred.resolve(inviteService.testData);
      console.log(inviteService.testData);
      //teste
      // $http.post(apiRoute + '/addInvitedUsers', userInfo).then(function(res) {
      //   deferred.resolve(res.data);
      // }, deferred.reject);

      return deferred.promise;
    };
    inviteService.removeInvitedUser = function(userInfo) {
      var deferred = $q.defer();

      // $http.post(apiRoute + '/removeInvitedUsers', userInfo).then(function(res) {
      //   deferred.resolve(res.data);
      // }, deferred.reject);
      var tempArray = [];
      for (var i = 0; i < inviteService.testData.length; i++) {
        if (inviteService.testData[i].account != userInfo) {
          tempArray[tempArray.length] = inviteService.testData[i];
        }
      }
      inviteService.testData = tempArray;
      deferred.resolve(inviteService.testData);

      return deferred.promise;
    }
    inviteService.getInvitedUserInfoList = function(userInfo) {
      var deferred = $q.defer();
      //tests
      deferred.resolve(inviteService.testData);
      //teste
      // $http.post(apiRoute + '/getInvitedUserInfoList', userInfo).then(function(res) {
      //   deferred.resolve(res.data);
      // }, deferred.reject);

      return deferred.promise;
    }
    return inviteService;
  }])