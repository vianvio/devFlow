'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

gulp.task('sass-watch', ['inject'], function() {
  gulp.watch([paths.src + '/app/components/**/*.scss',
    paths.src + '/app/shared/**/*.scss',
    paths.src + '/app/*.scss'
  ], ['sass']);
});

gulp.task('watch', ['inject'], function() {
  gulp.watch([
    paths.src + '/*.html',
    paths.src + '/{app,components}/**/*.css',
    paths.src + '/{app,components}/**/*.js',
    paths.src + '/{app}/{components}/**/*.js',
    paths.src + '/{app}/{components}/**/*.scss',
    'bower.json'
  ], ['inject']);
});
