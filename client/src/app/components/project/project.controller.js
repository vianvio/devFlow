'use strict';

angular.module('devCooperation').controller('projectCtrl', ['$scope', '$rootScope', '$modal', '$state', 'projectService', 'socketService', 'localStorageService', 'Session',
  function($scope, $rootScope, $modal, $state, projectService, socketService, localStorageService, Session) {
    var _fileNodes = {};

    function initialize() {
      $scope.arrFileStructure = [];
      _fileNodes = {};
      // check current user & project's owner
      if (Session.currentUser().userId === localStorageService.get('currentProjectInfo').ownerId) {
        $scope.bOwnerOfProject = true;
      } else {
        $scope.bOwnerOfProject = false;
      }

      // get clients list
      projectService.getFileStructure($state.params.projectId).then(function(data) {
        // build tree object
        data.forEach(function(item) {
          if (item.isFolder) {
            item.bOpen = false;
          }
          if (_fileNodes['nodeLevel' + item.level]) {
            _fileNodes['nodeLevel' + item.level].push(item);
          } else {
            _fileNodes['nodeLevel' + item.level] = [item];
          }
        });
        // for no file uploaded, level0 will be undefined
        if (_fileNodes.nodeLevel0) {
          // level 0 to get first id. Level 0 only has one element
          $scope.arrFileStructure = _getChildNode(1, _fileNodes.nodeLevel0[0].id);
        }
      });
    }

    var _getChildNode = function(currentLevel, parentId) {
      var _result = [];
      if (_fileNodes['nodeLevel' + currentLevel]) {
        _fileNodes['nodeLevel' + currentLevel].forEach(function(file) {
          if (file.parentId == parentId) {
            file.nodes = _getChildNode(file.level + 1, file.id);
            _result.push(file);
          }
        });
      }
      return _result;
    };

    $scope.getAceReadonlyStatus = function(fileInfo) {
      var _result = true;
      if (fileInfo) {
        _result = !fileInfo.isLocked || fileInfo.lockedById != Session.currentUser().userId;
      }
      return _result;
    };

    $scope.getUnlockBtnStatus = function(fileInfo) {
      var _result = true;
      if (fileInfo) {
        _result = fileInfo.lockedById != Session.currentUser().userId;
      }
      return _result;
    };

    $scope.bowerInstall = function() {
      projectService.execBowerInstall($scope.folderInfo);
    };

    $scope.npmInstall = function() {
      projectService.execNpmInstall($scope.folderInfo);
    };

    $scope.lockFile = function(fileInfo) {
      projectService.lockFile(fileInfo).then(function(newFileInfo) {
        projectService.getFileStructureById(newFileInfo.id).then(function(data) {
          socketService.getSocket().emit('add new team info', 'USER: ' + data.lockedBy.username + '---> Locked a file to edit. File name: ' + data.name);
          data.fileContent = fileInfo.fileContent;
          $scope.fileInfo = data;
        });
      });
    };

    $scope.saveFile = function(fileInfo) {
      projectService.saveFile(fileInfo).then(function(newFileInfo) {

      });
    };

    /* modals start */
    $scope.uploadProject = function() {
      var modalInstance = $modal.open({
        templateUrl: "upload.html",
        controller: "uploadModalController",
        windowClass: "upload-form"
      });


      modalInstance.result.then(function() {
        initialize();
      }, function() {

      });
    };

    $scope.shareProject = function() {
      var modalInstance = $modal.open({
        templateUrl: "share-project.html",
        controller: "shareProjectModalController",
        windowClass: "share-project-form"
      });


      modalInstance.result.then(function() {
        // initialize();
      }, function() {

      });
    };
    /* modals end */

    /* public events start */
    $scope.$on('project:loadFile', function(event, fileInfo, editorMode) {
      if (!editorMode) editorMode = 'javascript';
      $scope.bFile = true;
      $scope.fileInfo = fileInfo;
      $scope.editorMode = {
        mode: editorMode
      };
    });

    $scope.$on('project:loadFolder', function(event, folderInfo) {
      $scope.bFile = false;
      $scope.folderInfo = folderInfo;
    });
    /* public events end */

    /* socket events start */
    socketService.getSocket().on('add new team info', function(message) {
      var _holder = angular.element('.project-team-info-holder');
      message.split('\n').forEach(function(content) {
        _holder.append('<div class="project-team-info">' + content + '</div>');
      });
      _holder.scrollTop(_holder.prop('scrollHeight'));
    });
    /* socket events end */

    /* cache doc every min */
    // setInterval(function() {
    //   console.log($scope.fileInfo.fileContent);
    // }, 60000);



    initialize();
  }
]);
