'use strict';

// var loopback = require('loopback');
// var app = module.exports = loopback();

module.exports = function(UserModel) {
  // var User = app.models.User;
  UserModel.afterRemote('create', function(ctx, userModel, next) {
    ctx.result = {
      bError: false,
      message: 'Regist successfully.',
      result: userModel
    }
    next();
  });

  UserModel.beforeRemote('login', function(ctx, credential, next) {
    ctx.args.credentials.ttl = 3600;
    next();
  });

  // UserModel.login = function(cridential, cb) {
  //   cridential.ttl = 60;
  //   User.login(cridential, function(err, accessToken) {
  //     if (err) {
  //       cb(null, {
  //         bError: true,
  //         message: err,
  //         result: {}
  //       });
  //     } else {
  //       cb(null, {
  //         bError: false,
  //         message: 'Login successfully.',
  //         result: accessToken
  //       });
  //     }
  //   });
  // };

  // UserModel.remoteMethod('login', {
  //   http: {
  //     path: '/login',
  //     verb: 'post'
  //   },
  //   accepts: {
  //     arg: 'cridential',
  //     type: 'Object'
  //   },
  //   returns: {
  //     arg: 'data',
  //     type: 'Object'
  //   }
  // })
};
