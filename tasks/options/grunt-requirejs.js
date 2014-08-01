module.exports = {
  compile: {
    options: {
      baseUrl: './lib',
      out: 'dist/jasmine_react.js',
      mainConfigFile: '.requirejs',
      optimize: 'none',

      removeCombined:           false,
      inlineText:               true,
      preserveLicenseComments:  false,

      uglify: {
        toplevel:         true,
        ascii_only:       true,
        beautify:         false,
        max_line_length:  1000,
        no_mangle:        false
      },

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

      pragmas: {
        production: true
      },

      paths: {
        'underscore': 'empty:',
        'lodash': 'empty:',
        'jquery': 'empty:',
        'react': 'empty:',
        'rsvp': 'empty:',
      },

      name: 'jasmine_react'
    }
  }
};