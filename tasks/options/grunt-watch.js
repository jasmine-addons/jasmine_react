module.exports = {
  options: {
    nospawn: false
  },

  lint: {
    files: [ 'lib/**/*', 'test/**/*' ],
    tasks: [ 'jshint' ]
  },

  tests: {
    files: [ 'test/**/*.js', 'lib/**/*.js' ],
    tasks: [ 'test' ]
  },

  scripts: {
    files: [ 'lib/**/*.js' ],
    tasks: [ 'build' ]
  },
};