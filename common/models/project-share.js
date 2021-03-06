module.exports = function(ProjectShare) {
  ProjectShare.afterRemote('create', function(ctx, projectShare, next) {
    ctx.result = {
      bError: false,
      message: 'Share project successfully.',
      result: projectShare
    }
    next();
  });

  // can package to a common class?
  ProjectShare.observe('before save', function(ctx, next) {
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

  var _checkDuplication = function(projectShare, ctx, next) {
    ProjectShare.find({
      where: {
        and: [{
          projectId: projectShare.projectId
        }, {
          sharedUserId: projectShare.sharedUserId
        }]
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
      err.message = 'Project has already shared to this user';
      err.stack = ''; // less info to be sent
      next(err);
    } else {
      next();
    }
  };
};
