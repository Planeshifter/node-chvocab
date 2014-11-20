module.exports = (grunt) ->
  grunt.initConfig
    watch:
      files: [ '**/*.coffee' ]
      tasks: [ 'coffee:build']
    coffee:
      build:
        expand: true,
        cwd: 'src',
        src: [ '**/*.coffee' ],
        dest: 'lib',
        ext:  '.js'

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.registerTask 'default', ['coffee']
