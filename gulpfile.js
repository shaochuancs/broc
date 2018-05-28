'use strict';

const gulp = require('gulp');
const del = require('del');
const eslint = require('gulp-eslint');
const gulpif = require('gulp-if');
const htmlhint = require('gulp-htmlhint');
const less = require('gulp-less');
const gutil = require('gulp-util');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const libList = require('./web/static/lib/lib-list');
const jest = require('jest-cli');
const runSequence = require('run-sequence');
const babelify = require('babelify');

const isProdMode = process.env.NODE_ENV !== 'development';
const isDebugMode = process.env.NODE_ENV === 'debug';

// Views
gulp.task('views', function(){
  return gulp.src(['web/views/**/*.html'])
    .pipe(htmlhint({
      'doctype-first': false
    }))
    .pipe(htmlhint.failReporter())
    .pipe(gulp.dest('web/static/'));
});

// Stylesheets
gulp.task('stylesheets', function(){
  return gulp.src(['web/stylesheets/**/*.less'])
    .pipe(less({
      paths: ['./web']
    }))
    .on('error', gutil.log)
    .pipe(autoprefixer({browsers: ['> 1% in CN'], cascade: false}))
    .pipe(gulpif(isProdMode, cleanCSS()))
    .pipe(gulp.dest('web/static/compiled/stylesheets'));
});

gulp.task('lint', function() {
  return gulp.src(['**/*.js','!node_modules/**', '!web/static/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

//Scripts
gulp.task('broc_scripts', function() {
  return browserify({
    entries: ['./web/components/broc.jsx'],
    transform: [babelify],
    extensions: ['.jsx']
  }).bundle()
    .pipe(source('broc.js'))
    .pipe(buffer())
    .pipe(gulpif(isProdMode, uglify({
      mangle: false,
      compress: true
    })))
    .pipe(gulp.dest('./web/static/compiled/scripts'));
});

gulp.task('broc_lib', ['broc_lib_map'], function(){
  return gulp.src(libList.lib)
    .pipe(gulpif(isProdMode, uglify({
      mangle: false,
      compress: true
    })))
    .pipe(concat('broc.lib.js'))
    .pipe(gulp.dest('web/static/compiled/scripts'));
});
//Third party libraries map
gulp.task('broc_lib_map', function(){
  var glob = gulp.src(libList.map);
  if (!isProdMode) {
    return glob.pipe(gulp.dest('web/static/compiled/scripts'));
  } else {
    return glob;
  }
});

gulp.task('test', function(callback) {
  process.env.DEBUG = 'test';
  jest.runCLI({}, __dirname, function(result) {
    if (!result) {
      gutil.log('FAIL - Jest tests failed!');
      return process.exit(1);
    }
    callback();
  });
});

// Clean
gulp.task('clean', function(cb) {
  del(['web/static/compiled/views', 'web/static/compiled/stylesheets', 'web/static/compiled/scripts']).then(function(){
    cb();
  });
});

// Default task
gulp.task('default', ['clean'], function() {
  let initialTasks = ['views', 'stylesheets', 'lint'];
  if (isDebugMode) {
    initialTasks.pop();
  }

  runSequence(initialTasks, ['broc_lib', 'broc_scripts']);
});