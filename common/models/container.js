var zipper = require('zip-local');
var fs = require('fs');

module.exports = function(Container) {
  var _userId = '';
  var _fileSplit = '../../';
  Container.afterRemote('upload', function(ctx, file, next) {
    var fileInfo = file.result.files.file[0];
    var formInfo = file.result.fields;
    var filePath = _fileSplit + "server/uploads/" + fileInfo.container + "/" + fileInfo.name;

    _userId = ctx.req.accessToken.userId;
    _updateRelatedProject(formInfo, filePath, next);
  });

  var _updateRelatedProject = function(formInfo, filePath, next) {
    // update project
    var Project = Container.app.models.Project;
    // should be projectId[0], since it has to be an array at the front-end
    Project.findById(formInfo.projectId[0], function(err, project) {
      if (err) {
        next(err);
      }
      if (project) {
        project.updateAttributes({
          'projectFile': filePath
        }, function(err, newProject) {
          if (err) next(err);
          // unzip file and update the file structure
          _unzipToGetFileStructure(newProject, next);
        });
      } else {
        // no project find, error
        var err = new Error();
        err.statusCode = 422;
        err.bError = true;
        err.message = 'Project Id is invalid.';
        err.stack = ''; // less info to be sent
        next(err);
      }
    });
  };

  var _unzipToGetFileStructure = function(project, next) {
    var _unzipPath = __dirname + '/' + project.projectFile.split('.zip')[0];
    // make folder
    fs.mkdirSync(_unzipPath);
    // unzip to the same path
    zipper.sync.unzip(__dirname + '/' + project.projectFile).save(_unzipPath);

    Container.app.models.FileStructure.destroyAll({
      projectId: project.id
    }, function(err) {
      if (err) throw err;
      saveFileInfo({
        level: 0,
        parentId: 0,
        levelIndex: 0,
        fileUrl: _unzipPath,
        projectId: project.id
      });
    });
    next();
  };

  var saveFileInfo = function(fileObj) {
    var FileStructure = Container.app.models.FileStructure;

    var _folderReorder = 1000;
    // so there always less than 1000 folder. It should be ok. Otherwise, the project is too large.
    if (!fs.lstatSync(fileObj.fileUrl).isDirectory()) {
      _folderReorder = 1000 + fileObj.levelIndex;
    } else {
      _folderReorder = fileObj.levelIndex;
    }
    FileStructure.create({
      name: fileObj.fileUrl.split('/')[fileObj.fileUrl.split('/').length - 1],
      level: fileObj.level,
      parentId: fileObj.parentId,
      levelIndex: _folderReorder,
      fileUrl: _fileSplit + fileObj.fileUrl.split(_fileSplit)[1],
      isFolder: fs.lstatSync(fileObj.fileUrl).isDirectory(),
      projectId: fileObj.projectId
    }, {
      userId: _userId
    }, function(err, instance) {
      if (err) throw err;
      if (fs.lstatSync(fileObj.fileUrl).isDirectory()) {
        var arrInnerFile = fs.readdirSync(fileObj.fileUrl);
        arrInnerFile.forEach(function(innerFile, innerIndex) {
          // scan the path. skip folder start with ( _ | . | ,)
          if (!/^(\_|\.|\,.*)|node_modules|bower_components/gi.test(innerFile)) {
            saveFileInfo({
              level: fileObj.level + 1,
              parentId: instance.id,
              levelIndex: innerIndex,
              fileUrl: fileObj.fileUrl + '/' + innerFile,
              projectId: fileObj.projectId
            });
          }
        });
      }
    });
  };

  Container.getProjectFileByUrl = function(fileUrl, fileId, req, res, cb) {
    // get latest file info
    Container.app.models.FileStructure.findById(fileId, {
      include: ['owner', 'lastUpdatedBy']
    }, function(err, fileStructure) {
      if (err) {
        cb(null, {
          bError: true,
          message: 'Fail to get file.',
          result: {
            errorStack: err
          }
        });
      } else {
        fs.readFile(__dirname + '/' + fileUrl, "utf-8", function(err, data) {
          if (err) {
            cb(null, {
              bError: true,
              message: 'Fail to get file.',
              result: {
                errorStack: err
              }
            });
          } else {
            fileStructure.fileContent = data;
            cb(null, {
              bError: false,
              message: 'Succeed to get file.',
              result: {
                data: fileStructure
              }
            });
          }
        });
      }
    });
  };

  Container.remoteMethod('getProjectFileByUrl', {
    http: {
      path: '/getProjectFileByUrl',
      verb: 'post'
    },
    accepts: [{
      arg: 'fileUrl',
      type: 'String'
    }, {
      arg: 'fileId',
      type: 'String'
    }, {
      arg: 'req',
      type: 'object',
      'http': {
        source: 'req'
      }
    }, {
      arg: 'res',
      type: 'object',
      'http': {
        source: 'res'
      }
    }],
    returns: {
      arg: 'content',
      type: 'Object'
    }
  });
}
