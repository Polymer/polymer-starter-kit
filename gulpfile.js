const gulp = require('gulp');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const logging = require('plylog');
const mergeStream = require('merge-stream');

const polymer = require('polymer-build');

// Got problems? Try logging 'em
// logging.setVerbose();

const PolymerProject = polymer.PolymerProject;
const fork = polymer.forkStream;

let project = new PolymerProject({
  root: process.cwd(),
  entrypoint: 'index.html',
  shell: 'src/psk-app.html',
});

gulp.task('default', () => {

  // process source files in the project
  let sources = project.sources()
    .pipe(project.splitHtml())
    // add compilers or optimizers here!
    .pipe(gulpif('*.{png,gif,jpg,svg}', imagemin({
      progressive: true, interlaced: true
    })))
    .pipe(project.rejoinHtml());

  // process dependencies
  let dependencies = project.dependencies()
    .pipe(project.splitHtml())
    // add compilers or optimizers here!
    .pipe(project.rejoinHtml());

  // merge the source and dependencies streams to we can analyze the project
  let allFiles = mergeStream(sources, dependencies)
    .pipe(project.analyze);

  // fork the stream in case downstream transformers mutate the files
  // this fork will vulcanize the project
  let bundled = fork(allFiles)
    .pipe(project.bundle)
    // write to the bundled folder
    .pipe(gulp.dest('build/bundled'));

  let unbundled = fork(allFiles)
    // write to the unbundled folder
    .pipe(gulp.dest('build/unbundled'));

  return mergeStream(bundled, unbundled);
});
