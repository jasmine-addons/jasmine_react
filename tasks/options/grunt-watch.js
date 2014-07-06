module.exports = {
  options: {
    nospawn: false
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