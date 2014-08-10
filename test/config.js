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
    'jasmine_rsvp': '../node_modules/jasmine-rsvp/dist/jasmine-rsvp-full',
    'rsvp': '../node_modules/jasmine-rsvp/dist/jasmine-rsvp-full',
    'lodash': '../node_modules/lodash/dist/lodash',
    'jquery': '../node_modules/jquery/dist/jquery',
    'react': '../vendor/react-with-addons-0.11.1',
    'inflection': '../node_modules/pixy/vendor/inflection',
  },

  deps: [
    'inflection',
    'jasmine_rsvp'
  ],

  callback: function() {
    // Avoid infinite loop in the pretty printer when trying to print objects with
    // circular references.
    jasmine.MAX_PRETTY_PRINT_DEPTH = 3;
  }
});