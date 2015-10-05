angular.module('devCooperation')
  .factory('projectService', ['$http', '$q', 'Session', 'api', '$rootScope', function($http, $q, Session, api, $rootScope) {
    var projectService = {};
    var apiRoute = api.isDev ? api.devRoute : api.proRoute;
    projectService.getFileStructure = function(projectId) {
      var deferred = $q.defer();
      $http.get(apiRoute + '/fileStructures?filter[include]=owner&filter[include]=lastUpdatedBy&filter[where][projectId]=' + projectId).
      then(function(res) {
        deferred.resolve(res.data);
      }, deferred.reject);

      return deferred.promise;
    };

    projectService.getFileStructureById = function(fileId) {
      var deferred = $q.defer();
      $http.get(apiRoute + '/fileStructures/' + fileId + '?filter[include]=owner&filter[include]=lastUpdatedBy&filter[include]=lockedBy').
      then(function(res) {
        deferred.resolve(res.data);
      }, deferred.reject);

      return deferred.promise;
    };

    projectService.loadFile = function(fileInfo) {
      $http.post(apiRoute + '/containers/getProjectFileByUrl', {
        fileUrl: fileInfo.fileUrl,
        fileId: fileInfo.id
      }).then(function(res) {
        console.log(res);
        fileInfo = res.data.content.result.data;

        var _editMode = '';
        if (/.*\.(js|json)/gi.test(fileInfo.fileUrl)) {
          _editMode = 'javascript';
        } else if (/.*\.css/gi.test(fileInfo.fileUrl)) {
          _editMode = 'css';
        } else if (/.*\.scss/gi.test(fileInfo.fileUrl)) {
          _editMode = 'scss';
        } else if (/.*\.html/gi.test(fileInfo.fileUrl)) {
          _editMode = 'html';
        }
        $rootScope.$broadcast('project:loadFile', fileInfo, _editMode);
      }, function(res) {
        console.log(res);
      });
    };

    projectService.loadFolder = function(folderInfo) {
      $rootScope.$broadcast('project:loadFolder', folderInfo);
    };

    projectService.execBowerInstall = function(folderInfo) {
      $http.post(apiRoute + '/projects/execBowerInstall', {
        folderUrl: folderInfo.fileUrl
      }).
      then(function(res) {
        console.log(res);
      }, function(res) {
        console.log(res);
      });
    };

    projectService.execNpmInstall = function(folderInfo) {
      $http.post(apiRoute + '/projects/execNpmInstall', {
        folderUrl: folderInfo.fileUrl
      }).
      then(function(res) {
        console.log(res);
      }, function(res) {
        console.log(res);
      });
    };

    projectService.lockFile = function(fileInfo) {
      var deferred = $q.defer();

      $http.put(apiRoute + '/fileStructures', {
        id: fileInfo.id,
        isLocked: true,
        lockedById: Session.currentUser().userId
      }).then(function(res) {
        deferred.resolve(res.data);
      }, function(res) {
        console.log(res);
      });

      return deferred.promise;
    };

    projectService.saveFile = function(fileInfo) {
      var deferred = $q.defer();

      $http.put(apiRoute + '/fileStructures/saveFile', {
        fileId: fileInfo.id,
        fileContent: fileInfo.fileContent
      }).then(function(res) {
        console.log(res);
        deferred.resolve(res.data);
      }, function(res) {
        console.log(res);
      });

      return deferred.promise;
    };

    return projectService;
  }]);
