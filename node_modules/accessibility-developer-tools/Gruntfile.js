module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    changelog: 'Changelog.md',

    'gh-release': {},

    closurecompiler: {
      minify: {
        requiresConfig: 'git-revision',
        files: {
          '.tmp/build/axs_testing.js': [
              './lib/closure-library/closure/goog/base.js',
              './src/js/axs.js',
              './src/js/BrowserUtils.js',
              './src/js/Constants.js',
              './src/js/Color.js',
              './src/js/DOMUtils.js',
              './src/js/AccessibilityUtils.js',
              './src/js/Properties.js',
              './src/js/AuditRule.js',
              './src/js/AuditRules.js',
              './src/js/AuditResults.js',
              './src/js/Audit.js',
              './src/audits/*'
          ]
        },
        options: {
          'language_in': 'ECMASCRIPT5',
          'formatting': 'PRETTY_PRINT',
          'summary_detail_level': 3,
          'warning_level': 'VERBOSE',
          'compilation_level': 'SIMPLE_OPTIMIZATIONS',
          'output_wrapper': "<%= grunt.file.read('scripts/output_wrapper.txt') %>",
          'externs': './src/js/externs/externs.js'
        }
      }
    },

    qunit: {
      all: ['test/index.html']
    },

    copy: {
      dist: {
        expand: true,
        cwd: '.tmp/build',
        src: '**/*',
        dest: 'dist/js'
      }
    },

    clean: {
      local: ['.tmp'],
      dist: ['dist']
    },

    bump: {
      options: {
        prereleaseName: 'rc',
        files: ['package.json', 'bower.json'],
        updateConfigs: ['pkg'],
        pushTo: "<%= grunt.config.get('gh-release.remote') %>",
        commitFiles: ['package.json', "<%= grunt.config.get('changelog') %>", 'bower.json', 'dist']
      }
    },

    coffee: {
      compile: {
        files: {
          '.tmp/util/gh_repo.js': 'scripts/gh_repo.coffee'
        }
      }
    },

    eslint: {
        options: {
            configFile: '.eslintrc'
        },
        target: ['./src/js/', './src/audits/']
    },

    prompt: {
      'gh-release': {
        options: {
          questions: [
            {
              config: 'gh-release.remote',
              type: 'input',
              message: 'Git Remote (usually upstream or origin)',
              default: 'upstream',
              validate: function(val) {
                return (grunt.util._.size(val) > 0);
              }
            },
            {
              config: 'gh-release.repo',
              type: 'input',
              message: 'Github Repository',
              default: 'GoogleChrome/accessibility-developer-tools',
              validate: function(val) {
                return (grunt.util._.size(val) > 0);
              }
            },
            {
              config: 'gh-release.username',
              type: 'input',
              message: 'Github Username',
              validate: function(val) {
                return (grunt.util._.size(val) > 0);
              }
            },
            {
              config: 'gh-release.password',
              type: 'password',
              message: 'Github Password or Token',
              validate: function(val) {
                return (grunt.util._.size(val) > 0);
              }
            }
          ]
        }
      }
    }
  });

  grunt.registerTask('changelog', function(type) {
    grunt.task.requires('bump-only:' + type);

    var dryRun = grunt.option('dry-run');
    var config = {
      data: {
        version: grunt.config.get('pkg.version'),
        releaseDate: grunt.template.today("yyyy-mm-dd")
      }
    };

    var stopRegex = /^\#\#\ [0-9]+.*$/m;
    var stopIndex = 0;
    var releaseNotes = '';
    var dest = grunt.config.get('changelog');
    var contents = grunt.file.read(dest);
    var headerTpl = "## <%= version %> - <%= releaseDate %>\n\n";
    var header = grunt.template.process(headerTpl, config);

    grunt.log.ok('changelog: Extracting release notes.');
    if (contents.length > 0) {
      if ((stopIndex = contents.search(stopRegex)) !== -1) {
        releaseNotes = contents.slice(0, stopIndex);
      }
    }

    grunt.config.set("gh-release.release-notes", releaseNotes);

    if (dryRun) {
      grunt.log.ok('changelog (dry): Prepending header to ' + dest);
      grunt.log.writeln(header);
    } else {
      grunt.file.write(dest, "" + header + contents);
    }

    grunt.log.writeln("Release Notes:\n" + releaseNotes);
    grunt.log.ok('changelog: Task completed.');
  });

  grunt.registerTask('gh-release', function() {
    // Compile and load GH Repo manager.
    grunt.task.requires('coffee:compile');
    var GHRepo = require('./.tmp/util/gh_repo');

    var dryRun = grunt.option('dry-run');
    var done = this.async();
    var config = grunt.config.get('gh-release');
    var pkg = grunt.config.get('pkg');
    var currentRelease = 'v' + pkg.version;
    var nextRelease = currentRelease.replace(/-rc\.[0-9]+/, '');
    var repo = new GHRepo(config);
    repo.log = function() { grunt.log.writeln.apply(grunt, arguments); };

    var payload = {
      tag_name: currentRelease,
      name: nextRelease,
      body: config['release-notes'],
      draft: true
    };

    grunt.log.writeln("gh-release: Searching for existing Github release:", nextRelease);
    repo.getReleaseByName(nextRelease)
      .then(function(release) {
        if (release) {
          if (dryRun) {
            grunt.log.ok('gh-release (dry): Updating existing Github release: ' + nextRelease);
            done();
          } else {
            payload.body += "\n" + release.body;
            repo.updateRelease(release, payload).then(function() {
              grunt.log.ok('Github release ' + nextRelease + ' updated successfully.');
              done();
            });
          }
        } else {
          if (dryRun) {
            grunt.log.ok('gh-release (dry): Creating new Github release: ' + nextRelease);
            done();
          } else {
            repo.createRelease(payload).then(function() {
              grunt.log.ok('Github release ' + nextRelease + ' created successfully');
              done();
            });
          }
        }
      })
      .catch(function(err) {
        throw err;
      });
  });

  grunt.registerTask('git-describe', function() {
    // Start async task
    var done = this.async();

    grunt.util.spawn({
      'cmd' : 'git',
      'args' : [ 'rev-parse', 'HEAD' ],
      'opts' : {
        'cwd' : '.'
      }
    }, function(err, result) {
      if (err) {
          grunt.log.error(err).verbose.error(result);
          done();
          return;
      }

      grunt.event.emit('git-describe', result.stdout);
      done();
    });
  });

  grunt.registerTask('release', function(releaseType) {
    if (typeof releaseType === 'undefined' || releaseType === null) {
      grunt.fail.fatal('You must specify a release type. i.e. grunt release:prerelease');
    }

    var dryRun = grunt.option('dry-run');

    var tasks = ['prompt:gh-release'];

    if (dryRun) {
      grunt.log.ok('Skipping build, clean:dist and copy:dist tasks in dry-run');
    } else {
      tasks.push('build', 'clean:dist', 'copy:dist');
    }

    tasks = tasks.concat([
      'test:unit',
      'bump-only:' + releaseType,
      'changelog:' + releaseType,
      'bump-commit',
      'coffee:compile',
      'gh-release'
    ]);

    grunt.task.run(tasks);
  });

  grunt.registerTask('save-revision', function() {
    grunt.event.once('git-describe', function (rev) {
      grunt.log.writeln('Git Revision: ' + rev);
      grunt.config.set('git-revision', rev);
    });
    grunt.task.run('git-describe');
  });

  grunt.registerTask('build', ['clean:local', 'save-revision', 'closurecompiler:minify']);
  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('test:unit', ['qunit']);
  grunt.registerTask('dist', ['clean:dist', 'build', 'copy:dist']);
  grunt.registerTask('travis', ['closurecompiler:minify', 'test:unit']);
  grunt.registerTask('default', ['build', 'test:unit']);
};
