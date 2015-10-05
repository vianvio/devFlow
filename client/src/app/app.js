'use strict'

angular.module('devCooperation', ['ngAnimate', 'ngCookies', 'ngSanitize',
  'ngResource', 'ui.router', 'ui.bootstrap',
  'leaflet-directive', 'ngTable', 'restangular',
  'LocalStorageModule', 'smart-table', 'angularModalService',
  'nya.bootstrap.select', 'base64', 'angularjs-dropdown-multiselect',
  'angularFileUpload', 'ui.ace'
]).
constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
}).
constant('api', {
  proRoute: 'http://strl099049.mso.net:8080/ida-api/api',
  // devRoute: '/ida-web/api', // for eclipse
  devRoute: '/api', // for intellij
  // devRoute: '', // this for app.backend.js
  isDev: true
}).
config(function(localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('devCooperation')
    .setStorageType('sessionStorage')
    .setStorageCookie(30, '/')
    .setNotify(true, true);
}).
config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push(function($q, $location) {
    return {
      'responseError': function(rejection) {
        var defer = $q.defer();
        if (rejection.status == 401) {
          $location.path('/logout');
        }
        defer.reject(rejection);
        return defer.promise;
      }
    };
  });
}]).
run(['$rootScope', '$location', 'localStorageService', '$http', '$templateCache', '$state', 'socketService',
  function($rootScope, $location, localStorageService, $http, $templateCache, $state, socketService) {
    // keep user logged in after page refresh
    $rootScope.currentUser = localStorageService.get('current-user') || null;
    if (!$rootScope.currentUser) {
      $location.path('/login');
    }

    $rootScope.$on('$locationChangeStart', function(event, next, current) {
      $http.defaults.headers.common.Authorization = localStorageService.get('current-user') ? localStorageService.get('current-user').tokenId : '';
      // redirect to login page if not logged in
      if (!$rootScope.currentUser) {
        $location.path('/login');
      } else {
        if ($location.path() === '/login') {
          $location.path('/welcome');
        }
      }

      if ($location.path() === '/logout') {
        $rootScope.currentUser = null;
        localStorageService.remove('current-user');
        socketService.disconnect();
        $location.path('/login');
      }
    });

    $rootScope.redirectTo = function(url, sourceUrl) {
      if (sourceUrl != null) Util.setSessionStorageItem("sourceUrl", sourceUrl);
      $location.path(url);
    };

  }
]);
