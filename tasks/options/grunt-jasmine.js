module.exports = {
  src: [],
  options : {
    timeout: 10000,
    outfile: 'tests.html',

    host: 'http://127.0.0.1:<%= grunt.config.get("connect.tests.options.port") %>/',

    template: require('grunt-template-jasmine-requirejs'),
    templateOptions: {
      requireConfigFile: [ '.requirejs', 'test/config.js' ],
      deferHelpers: true,
      defaultErrors: false
    },

    keepRunner: true,

    version: '2.0.0',

    styles: [],

    helpers: [
      'test/support/*.js',
      'test/helpers/*.js'
    ],

    specs: [
      'test/**/*_test.js'
    ]
  }
};