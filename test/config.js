/* global requirejs: false, jasmine: false */
requirejs.config({
  baseUrl: '../lib',

  map: {
    '*': {
      'test': '../../test',
      'underscore': 'lodash',
    }
  },

  paths: {
    'pixy': '../node_modules/pixy/dist/pixy',
    'pixy-jasmine': '../node_modules/pixy/dist/pixy-jasmine',
    'lodash': '../node_modules/lodash/dist/lodash',
    'jquery': '../node_modules/jquery/dist/jquery',
    'react': '../node_modules/pixy/vendor/react-0.10.0',
    'router': '../node_modules/pixy/dist/pixy',
    'rsvp': '../node_modules/pixy/dist/pixy',
    'inflection': '../node_modules/pixy/vendor/inflection',
  },

  deps: [
    'pixy',
    'pixy-jasmine'
  ],

  callback: function() {
    // Avoid infinite loop in the pretty printer when trying to print objects with
    // circular references.
    jasmine.MAX_PRETTY_PRINT_DEPTH = 3;
  }
});