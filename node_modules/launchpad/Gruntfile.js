module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    release: {},
    simplemocha: {
      options: {
        timeout: 600000,
        reporter: 'spec'
      },
      all: { src: ['test/**/*.js'] }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      lib: ['lib/**/*.js', 'Gruntfile.js'],
      test: ['test/**/*.js']
    }
  });

  grunt.registerTask('default', 'test');
  grunt.registerTask('test', [ 'jshint', 'simplemocha' ]);

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-simple-mocha');
};
