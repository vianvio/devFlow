module.exports = function(ChatRoom) {
  ChatRoom.afterRemote('create', function(ctx, chatRoom, next) {
    ctx.result = {
      bError: false,
      message: 'Add chat room successfully.',
      result: chatRoom
    }
    next();
  });

  ChatRoom.observe('before save', function(ctx, next) {
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

  var _checkDuplication = function(chatRoom, ctx, next) {
    ChatRoom.find({
      where: {
        name: chatRoom.name
      }
    }, function(err, chatRooms) {
      if (err) throw err;
      if (chatRooms.length > 0) {
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
      err.message = 'ChatRoom name is duplicated';
      err.stack = ''; // less info to be sent
      next(err);
    } else {
      next();
    }
  };
};
