var gulp = require('gulp');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var gulpLoadPlugins = require('gulp-load-plugins');

var globby = require('globby');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var through = require('through2');
var gutil = require('gulp-util');

const reload = browserSync.reload;
const $ = gulpLoadPlugins();

const sources = ['src/**/*.js', 'src/app.js']
const outfile = 'bundle.js'

// https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-with-globs.md
gulp.task('scripts', function (callback) {
  // gulp expects tasks to return a stream, so we create one here.
  var bundledStream = through();

  bundledStream
    .pipe($.plumber({
      handleError: function(err) {
        console.log("Plumber!")
        console.log(err)
        this.emit('end');
      }
    }))
    // turns the output bundle stream into a stream containing
    // the normal attributes gulp plugins expect.
    .pipe(source(outfile))
    // the rest of the gulp task, as you would normally write it.
    // here we're copying from the Browserify + Uglify2 recipe.
    .pipe(buffer())
    .pipe($.sourcemaps.init({loadMaps: true}))
      // Add gulp plugins to the pipeline here.
      .pipe($.uglify())
      .on('error', function(err) {
        console.log("Error: " + err);
        gutil.log();
      })
    .pipe($.sourcemaps.write('./'))
    .pipe($.size({title: 'scripts'}))
    .pipe(gulp.dest('./dist'))
    .on('end', function() {
      console.log('Ended');
      // callback();
    })

  // "globby" replaces the normal "gulp.src" as Browserify
  // creates it's own readable stream.
  globby(sources).then(function(entries) {
    console.log("globby start (" + entries + ")");

    // create the Browserify instance.
    // "debug: true" means "apply source maps"
    var b = browserify({
      debug: true,
      entries: entries
    });

    // pipe the Browserify stream into the stream we created earlier
    // this starts our gulp pipeline.
    //
    // b.bundle(cb)
    // Bundle the files and their dependencies into a
    // single javascript file.
    // See: https://github.com/substack/node-browserify
    b.transform('babelify').bundle().pipe(bundledStream);

    console.log("globby ended");
  }).catch(function(err) {
    console.log("Error during globby()");
    // ensure any errors from globby are handled
    bundledStream.emit('error', err);
  });

  // finally, we return the stream, so gulp knows when this task is done.
  return bundledStream;
});

gulp.task('reload', ['scripts'], function() {
  reload()
});

// Static server
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch(['*.html'], ['reload']);
  gulp.watch(sources, ['scripts', 'reload']);
});

gulp.task('lint', function() {
  gulp.src(sources)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failOnError()))
});

gulp.task('default', ['scripts'])

