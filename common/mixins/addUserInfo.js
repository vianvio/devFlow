module.exports = function(Model, options) {
  // observe for save in logic.
  Model.observe('before save', function(ctx, next) {
    // check user id. Since api call will also fire these, take user id as a flag
    console.log('from before save');
    if (ctx.options.userId) {
      if (!ctx.isNewInstance) {
        // update
        if (ctx.instance) {
          ctx.instance.lastUpdatedBy = ctx.options.userId;
        } else {
          ctx.data.lastUpdatedBy = ctx.options.userId;
        }
      } else {
        // create
        if (ctx.instance) {
          ctx.instance.ownerId = ctx.options.userId;
          ctx.instance.lastUpdatedBy = ctx.options.userId;
        } else {
          ctx.instance.ownerId = ctx.options.userId;
          ctx.data.lastUpdatedBy = ctx.options.userId;
        }
      }
    }
    next();
  });

  // remote hook for rest api.
  Model.beforeRemote('create', function(ctx, obj, next) {
    if ((!ctx.options) || (ctx.options && ctx.options.skipUserInfo)) {
      return next();
    }
    // console.log('before create: ' + ctx.args.data + ', ' + ctx.req.accessToken + ', ' + ctx.req.accessToken.userId);
    if (ctx.args.data && ctx.req.accessToken && ctx.req.accessToken.userId) {
      ctx.args.data.ownerId = ctx.req.accessToken.userId;
      ctx.args.data.lastUpdatedBy = ctx.req.accessToken.userId;
    }
    next();
  });

  Model.beforeRemote('upsert', function(ctx, obj, next) {
    console.log('from upsert');
    if ((!ctx.options) || (ctx.options && ctx.options.skipUserInfo)) {
      return next();
    }
    if (ctx.args.data && ctx.req.accessToken && ctx.req.accessToken.userId) {
      ctx.args.data.lastUpdatedBy = ctx.req.accessToken.userId;
    }
    next();
  });

  Model.beforeRemote('updateAll', function(ctx, obj, next) {
    console.log('from updateall');
    // need confirm: data is array?
    if ((!ctx.options) || (ctx.options && ctx.options.skipUserInfo)) {
      return next();
    }
    if (ctx.args.data && ctx.req.accessToken && ctx.req.accessToken.userId) {
      ctx.args.data.forEach(function(item) {
        item.lastUpdatedBy = ctx.req.accessToken.userId;
      });
    }
    next();
  });
}
