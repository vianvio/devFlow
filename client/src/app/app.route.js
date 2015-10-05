'use strict';

angular.module('devCooperation')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/components/login/login.html',
        controller: "LoginController"
      })
      .state('project', {
        url: '/project/:projectId',
        templateUrl: 'app/components/project/project.html'
      })
      .state('clients', {
        url: '/clients',
        templateUrl: 'app/components/clients/clients.html'
      })
      .state('clients.detail', {
        url: '/:clientId',
        templateUrl: 'app/components/clients/detail/detail.html'
      })
      .state('session', {
        url: '/clients/:clientId/session/:sessionId',
        templateUrl: 'app/components/session/session.html'
      })
      .state('session.question', {
        url: '/:areaName/:areaId',
        templateUrl: 'app/components/session/question/question.html'
      })
      .state('welcome', {
        url: '/welcome',
        templateUrl: 'app/components/welcome/welcome.html'
      })
      .state('main', {
        url: '/main',
        templateUrl: 'app/components/main/main.html'
      });


    $urlRouterProvider.otherwise('/welcome');
  });
