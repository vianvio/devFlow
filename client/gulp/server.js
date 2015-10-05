'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var util = require('util');

var browserSync = require('browser-sync');
var proxyMiddleware = require('http-proxy-middleware');

var middleware = require('./proxy');

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if (baseDir === paths.src || (util.isArray(baseDir) && baseDir.indexOf(paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }
  var server = {
    baseDir: baseDir,
    routes: routes,
    middleware: [
      // proxyMiddleware('/ida-web/api/', { // for eclipse
      proxyMiddleware('/api/', { // for Intellij
        // target: 'http://172.31.60.146:8080' // for eclipse
        target: 'http://localhost:3000'
      })
    ]
  };

  browserSync.instance = browserSync.init({
    port: 3002,
    startPath: '/',
    server: server,
    browser: browser
  });
  // browserSync.instance = browserSync.init(files, {
  //   startPath: '/',
  //   server: {
  //     baseDir: baseDir,
  //     middleware: middleware,
  //     routes: routes
  //   },
  //   browser: browser
  // });
}

gulp.task('serve', ['sass-watch', 'watch'], function() {
  browserSyncInit([
    paths.tmp + '/serve',
    paths.src
  ], [
    paths.src + '/{app,components}/**/*.css',
    paths.src + '/{app,components}/**/*.scss',
    paths.src + '/{app,components}/**/*.js',
    paths.src + 'src/assets/images/**/*',
    paths.tmp + '/serve/*.html',
    paths.tmp + '/serve/{app,components}/**/*.html',
    paths.src + '/{app,components}/**/*.html'
  ]);
});

gulp.task('serve:dist', ['build'], function() {
  browserSyncInit(paths.dist);
});

gulp.task('serve:e2e', ['inject'], function() {
  browserSyncInit([paths.tmp + '/serve', paths.src], null, []);
});

gulp.task('serve:e2e-dist', ['build'], function() {
  browserSyncInit(paths.dist, null, []);
});
