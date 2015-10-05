module.exports = function(Project) {
  Project.afterRemote('create', function(ctx, project, next) {
    ctx.result = {
      bError: false,
      message: 'Create project successfully.',
      result: project
    }
    next();
  });

  // cannot return clean message.
  // Project.validatesUniquenessOf('name', {message: 'Project name is duplicated'});

  // can package to a common class?
  Project.observe('before save', function(ctx, next) {
    // check duplication
    if (ctx.instance && ctx.isNewInstance) {
      _checkDuplication(ctx.instance, ctx, next);
    } else if (ctx.data && ctx.isNewInstance) {
      _checkDuplication(ctx.data, ctx, next);
    } else if (!ctx.isNewInstance) {
      // update
      next();
    } else {
      var err = new Error();
      err.statusCode = 422;
      err.bError = true;
      err.message = 'No data receieved.';
      err.stack = ''; // less info to be sent
      next(err);
    }
  });

  var _checkDuplication = function(project, ctx, next) {
    Project.find({
      where: {
        name: project.name
      }
    }, function(err, projects) {
      if (err) throw err;
      if (projects.length > 0) {
        _afterCheck(true, ctx, next);
      } else {
        _afterCheck(false, ctx, next);
      }
    });
  };

  var _afterCheck = function(bDuplicated, ctx, next) {
    if (bDuplicated) {
      delete ctx.instance;
      delete ctx.data;
      var err = new Error();
      err.statusCode = 422;
      err.bError = true;
      err.message = 'Project name is duplicated';
      err.stack = ''; // less info to be sent
      next(err);
    } else {
      next();
    }
  };

  Project.execBowerInstall = function(folderUrl, req, res, cb) {
    Project.app.models.userModel.findById(req.accessToken.userId, function(err, user) {
      var spawn = require('child_process').spawn;
      var cmd = spawn('bower', ['install'], {
        detached: true,
        // stdio: 'inherit'
        cwd: __dirname + '/' + folderUrl
      });

      cmd.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
        Project.app.io.emit('add new team info', 'USER: ' + user.username + '---> ' + data.toString('utf8'));
      });

      cmd.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
        Project.app.io.emit('add new team info', 'USER: ' + user.username + '---> ' + data.toString('utf8'));
      });

      cmd.on('close', function(code) {
        console.log('child process exited with code ' + code);
        if (code !== -2) {
          cb(null, {
            bError: false,
            message: 'Finish bower install',
            result: {
              code: code
            }
          });
        }
      });

      cmd.on('error', function(err) {
        cb(null, {
          bError: true,
          message: 'Fail bower install',
          result: {
            error: err
          }
        });
      });
    });
  };

  Project.remoteMethod('execBowerInstall', {
    http: {
      path: '/execBowerInstall',
      verb: 'post'
    },
    accepts: [{
      arg: 'folderUrl',
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

  Project.execNpmInstall = function(folderUrl, req, res, cb) {
    // get user info
    Project.app.models.userModel.findById(req.accessToken.userId, function(err, user) {
      var spawn = require('child_process').spawn;
      var cmd = spawn('npm', ['install'], {
        detached: true,
        // stdio: 'inherit'
        cwd: __dirname + '/' + folderUrl
      });

      cmd.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
        // TODO: add user info
        Project.app.io.emit('add new team info', 'USER: ' + user.username + '---> ' + data.toString('utf8'));
      });

      cmd.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
        Project.app.io.emit('add new team info', 'USER: ' + user.username + '---> ' + data.toString('utf8'));
      });

      cmd.on('close', function(code) {
        console.log('child process exited with code ' + code);
        if (code !== -2) {
          cb(null, {
            bError: false,
            message: 'Finish npm install',
            result: {
              code: code
            }
          });
        }
      });

      cmd.on('error', function(err) {
        cb(null, {
          bError: true,
          message: 'Fail bower install',
          result: {
            error: err
          }
        });
      });
    });
  };

  Project.remoteMethod('execNpmInstall', {
    http: {
      path: '/execNpmInstall',
      verb: 'post'
    },
    accepts: [{
      arg: 'folderUrl',
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
