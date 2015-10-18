'use strict';

angular.module('devCooperation').controller('welcomeCtrl', ['$scope', '$rootScope', '$modal', '$state', 'welcomeService', 'localStorageService',
  function($scope, $rootScope, $modal, $state, welcomeService, localStorageService) {
    function initialize() {
      $scope.arrProjects = [];
      $scope.arrSharedProjects = [];
      // get clients list
      welcomeService.getProjectList().then(function(data) {
        $scope.arrProjects = data;
      });

      welcomeService.getSharedProjectList().then(function(data) {
        data.forEach(function(sharingInfo) {
          sharingInfo.project.bShared = true;
          $scope.arrSharedProjects.push(sharingInfo.project);
        });
      });
    }

    $scope.createProject = function() {
      var modalInstance = $modal.open({
        templateUrl: "new-project.html",
        controller: "newProjectModalController",
        windowClass: "new-project-form"
      });


      modalInstance.result.then(function() {
        initialize();
      }, function() {

      });
    };

    $scope.openProject = function(project) {
      // cache current project's ownerId
      localStorageService.remove('currentProjectInfo');
      localStorageService.set('currentProjectInfo', {
        projectId: project.id,
        ownerId: project.ownerId,
        projectName: project.name
      })
      $state.go('projectApiConfig', {
        projectId: project.id
      });
    };

    initialize();
  }
]);
