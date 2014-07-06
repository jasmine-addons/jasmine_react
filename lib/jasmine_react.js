/* global jasmine: false, expect: false */
define(function(require) {
  var React = require('react');
  var Matchers = require('./jasmine_react/matchers');
  var DOMHelpers = require('./jasmine_react/dom_helpers');
  var DOMHelperKeys = Object.keys(DOMHelpers).map(function(key) {
    if (DOMHelpers.hasOwnProperty(key)) {
      return key;
    }
  }).filter(function(key) { return !!key; });

  var exports = jasmine.Suite.prototype;

  /** @internal Used for exposing DOMHelpers into the global context */
  var GLOBAL = this;

  /** @internal */
  var exposeGlobals = function(subject) {
    jasmine.addMatchers(Matchers.matchers);

    DOMHelperKeys.forEach(function(key) {
      GLOBAL[key] = DOMHelpers[key];
    });

    GLOBAL.subject = subject;
  };

  /** @internal */
  var cleanupGlobals = function() {
    delete GLOBAL.subject;

    DOMHelperKeys.forEach(function(key) {
      delete GLOBAL[key];
    });
  };

  /** @internal */
  var ReactSuite = function(suite, componentType, container) {
    suite.mkPromiseSuite();
    suite.beforeEach(function() {
      expect(function() {
        this.subject = React.renderComponent(componentType(), container);
      }.bind(this)).not.toThrow();

      Matchers.setCurrentSuite(this);
      DOMHelpers.setSubject(this.subject);
      exposeGlobals(this.subject);
    });

    suite.afterEach(function() {
      this.subject = null;
      cleanupGlobals();
      DOMHelpers.setSubject(undefined);

      React.unmountComponentAtNode(container);
    });
  };

  /**
   * @class JasmineReact
   *
   * Turn a jasmine Suite into one suitable for testing React components.
   *
   * > WARNING!!!
   * > This requires jasmine.promiseSuite to be available from PixyJasmine.
   *
   * @param {Object} options
   *        Options to configure the suite.
   *
   * @param {React.Component} options.type (required)
   *        The component type that you're testing.
   *
   * Invocation example:
   *
   *     var Checkbox = require('jsx!components/checkbox');
   *
   *     describe('Components.Checkbox', function() {
   *       this.reactSuite({ type: Checkbox });
   *     });
   *
   * The following features will become available to your suite:
   *
   * === React Test Helpers
   *
   * All the React test helpers are injected into the global context throughout
   * your tests, so you can conveniently use things like `find()` and `click()`.
   *
   * Example:
   *
   *     it('should show a link', function() {
   *       expect(find('a:contains("My Link Text")').length).toBe(1);
   *     });
   *
   * See JasmineReact.DOMHelpers for more info on what's available.
   *
   * === Automatic component (un)mounting
   *
   * In your global suite context, "subject" will contain a reference to the
   * _mounted_ instance of the component you're testing, created and mounted
   * during each test in your suite.
   *
   * === Action testing
   *
   * To test if your component is sending actions correctly, a custom matcher
   * is exposed to your suite, called #toSendAction.
   *
   * See the corresponding docs for more info on the matcher.
   *
   * Example:
   *
   *     it('should send an action', function() {
   *       expect(function() {
   *         click('.my-button');
   *       }).toSendAction('users:destroyAccount');
   *     });
   */
  exports.reactSuite = function(options) {
    var container;

    if (!options.type) {
      throw new Error(
        "You must pass the React component type you're testing to reactSuite."
      );
    }

    container = options.container || jasmine.fixture;

    if (!container) {
      container = document.createElement('div');
    }

    ReactSuite(this, options.type, container);
  };

  return exports.reactSuite;
});