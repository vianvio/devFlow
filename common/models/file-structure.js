var fs = require('fs');

module.exports = function(FileStructure) {
  FileStructure.saveFile = function(fileId, fileContent, req, res, cb) {
    FileStructure.app.models.userModel.findById(req.accessToken.userId, function(err, user) {
      FileStructure.upsert({
      	id: fileId,
        isLocked: false,
        lockedById: '',
      }, {
        userId: req.accessToken.userId
      }, function(err, newFileStructure) {
        fs.writeFile(__dirname + '/' + newFileStructure.fileUrl, fileContent, 'utf8', function(err) {
          if (err) {
            cb(null, {
              bError: true,
              message: 'Fail bower install',
              result: {
                error: err
              }
            });
          } else {
            FileStructure.findById(newFileStructure.id, {
              include: ['owner', 'lastUpdatedBy', 'lockedBy']
            }, function(err, fileStructure) {
              FileStructure.app.io.emit('add new team info', 'USER: ' + user.username + '---> Saved a File. File name: ' + fileStructure.name);
              cb(null, {
                bError: false,
                message: 'Save file Successfully',
                result: fileStructure
              });
            });
          }
        });
      });
    });
  };

  FileStructure.remoteMethod('saveFile', {
    http: {
      path: '/saveFile',
      verb: 'put'
    },
    accepts: [{
      arg: 'fileId',
      type: 'String'
    }, {
      arg: 'fileContent',
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
      arg: 'result',
      type: 'Object'
    }
  });
};
