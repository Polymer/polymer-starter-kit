'use strict';
var gutil = require('gulp-util'),
    through = require('through2'),
    useref = require('node-useref');

module.exports = function (opts) {
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-useref', 'Streaming not supported'));
            return;
        }

        var output = useref(file.contents.toString(), opts);
        var html = output[0];

        try {
            file.contents = new Buffer(html);
            this.push(file);
        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-useref', err));
        }

        cb();
    });
};

module.exports.assets = function (opts) {
    opts = opts || {};

    var path = require('path'),
        concat = require('gulp-concat'),
        gulpif = require('gulp-if'),
        es = require('event-stream'),
        types = opts.types || ['css', 'js'],
        glob = require('glob'),
        isRelativeUrl = require('is-relative-url'),
        vfs = require('vinyl-fs'),
        transforms = Array.prototype.slice.call(arguments, 1),
        restoreStream = through.obj(),
        unprocessed = 0,
        end = false,
        additionalFiles = [],
        waitForAssets;

    // If any external streams were included, add matched files to src
    if (opts.additionalStreams) {
        if (!Array.isArray(opts.additionalStreams)) {
            opts.additionalStreams = [opts.additionalStreams];
        }

        opts.additionalStreams = opts.additionalStreams.map(function (stream) {
            // filters stream to select needed files
            return stream
                .pipe(es.through(function (file) {
                    additionalFiles.push(file);
                }));
        });
    }

    if (opts.additionalStreams) {
        // If we have additional streams, wait for them to run before continuing
        waitForAssets = es.merge(opts.additionalStreams).pipe(through.obj());
    } else {
        // Else, create a fake stream
        waitForAssets = through.obj();
        waitForAssets.emit('finish');
    }

    var assetStream = through.obj(function (file, enc, cb) {
        var self = this;

        waitForAssets.pipe(es.wait(function () {
            var output = useref(file.contents.toString());
            var assets = output[1];

            types.forEach(function (type) {
                var files = assets[type];

                if (!files) {
                    return;
                }

                Object.keys(files).forEach(function (name) {
                    var src,
                        globs,
                        searchPaths,
                        filepaths = files[name].assets;

                    if (!filepaths.length) {
                        return;
                    }

                    unprocessed++;

                    if (files[name].searchPaths || opts.searchPath) {
                        if (opts.searchPath && Array.isArray(opts.searchPath)) {
                            opts.searchPath = '{' + opts.searchPath.join(',') + '}';
                        }
                        searchPaths = path.resolve(file.cwd, files[name].searchPaths || opts.searchPath);
                    }

                    // Get relative file paths and join with search paths to send to vinyl-fs
                    globs = filepaths
                        .filter(isRelativeUrl)
                        .map(function (filepath) {
                            var pattern = path.join((searchPaths || file.base), filepath),
                                matches = glob.sync(pattern, { nosort: true });

                            if (!matches.length) {
                                matches.push(pattern);
                            }
                            if (opts.transformPath) {
                                matches[0] = opts.transformPath(matches[0]);
                            }

                            return matches[0];
                        });

                    src = vfs.src(globs, {
                        base: file.base,
                        nosort: true
                    });

                    src.on('error', function (err) {
                        self.emit('error', new Error(err));
                    });

                    // add files from external streams
                    additionalFiles.forEach(function (file) {
                        src.push(file);
                    });

                    // if we added additional files, reorder the stream
                    if (additionalFiles.length > 0) {
                        var sortIndex = {},
                            i = 0,
                            sortedFiles = [],
                            unsortedFiles = [];

                        // Create a sort index so we don't iterate over the globs for every file
                        globs.forEach(function (filename) {
                            sortIndex[filename] = i++;
                        });

                        src = src.pipe(through.obj(function (file, enc, cb) {
                            var index = sortIndex[file.path];

                            if (index === undefined) {
                                unsortedFiles.push(file);
                            } else {
                                sortedFiles[index] = file;
                            }
                            cb();
                        }, function (cb) {
                            sortedFiles.forEach(function (file) {
                                if (file !== undefined) {
                                    this.push(file);
                                }
                            }, this);

                            unsortedFiles.forEach(function (file) {
                                this.push(file);
                            }, this);
                            cb();
                        }));
                    }

                    // If any external transforms were included, pipe all files to them first
                    transforms.forEach(function (fn) {
                        src = src.pipe(fn(name));
                    });

                    // Add assets to the stream
                    // If noconcat option is false, concat the files first.
                    src
                        .pipe(gulpif(!opts.noconcat, concat(name)))
                        .pipe(through.obj(function (newFile, enc, callback) {
                            // specify an output path relative to the cwd
                            if (opts.base) {
                                newFile.path = path.join(opts.base, name);
                            }

                            // add file to the asset stream
                            self.push(newFile);
                            callback();
                        }))
                        .on('finish', function () {
                            if (--unprocessed === 0 && end) {
                                // end the asset stream
                                self.emit('end');
                            }
                        });

                });
            });

            restoreStream.write(file);

            cb();
        }));
    }, function () {
        end = true;
        if (unprocessed === 0) {
            this.emit('end');
        }
    });

    assetStream.restore = function () {
        return restoreStream.pipe(through.obj(), { end: false });
    };

    return assetStream;
};
