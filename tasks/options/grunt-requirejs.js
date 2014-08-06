var _ = require('lodash');
var merge = _.merge;

var baseOptions = {
  baseUrl: './lib',
  mainConfigFile: '.requirejs',
  removeCombined:           false,
  inlineText:               true,
  preserveLicenseComments:  false,

  pragmas: {
    production: true
  },

  paths: {
    'underscore': 'empty:',
    'lodash': 'empty:',
    'jquery': 'empty:',
    'rsvp': 'empty:',
  },

  name: 'jasmine_react'
};

module.exports = {
  normal: {
    options: merge({}, baseOptions, {
      out: 'dist/jasmine_react.js',
      optimize: 'none',
      paths: {
        'react': 'empty:',
      }
    })
  },

  with_react: {
    options: merge({}, baseOptions, {
      out: 'dist/jasmine_react.full.js',
      optimize: 'uglify2',

      uglify2: {
        warnings: true,
        mangle:   true,

        output: {
          beautify: false
        },

        compress: {
          sequences:  true,
          dead_code:  true,
          loops:      true,
          unused:     true,
          if_return:  true,
          join_vars:  true
        }
      },
    })
  }
};