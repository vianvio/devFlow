var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');

var app = module.exports = loopback();
// add another static folder
app.use(loopback.static(path.resolve(__dirname, '../client/venderMissed')));

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) {
    // app.start();
    app.io = require('socket.io')(app.start());
    require('socketio-auth')(app.io, {
      authenticate: function(socket, data, callback) {
          var AccessToken = app.models.AccessToken;
          //get credentials sent by the client
          var token = AccessToken.find({
            where: {
              and: [{
                userId: data.userId
              }, {
                id: data.id
              }]
            }
          }, function(err, tokenDetail) {
            if (err) throw err;
            if (tokenDetail.length > 0) {
              callback(null, true);
            } else {
              callback(null, false);
            }
          }); //find function..    
        } //authenticate function..
    });
    app.io.on('connection', function(socket) {
      console.log('a user connected');
      socket.on('disconnect', function() {
        console.log('user disconnected');
      });

      socket.on('add new team info', function(msg) {
        socket.emit('add new team info', msg);
      });
    });
  }
});
