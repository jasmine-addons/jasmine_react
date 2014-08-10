/* global jasmine: false */
define('jasmine_react/matchers',['require','underscore','rsvp'],function(require) {
  var _ = require('underscore'); // _.template
  var RSVP = require('rsvp');
  var currentSuite;
  var actionIndex, actionSpy, sendAction;
  var active, simulatedError;

  RSVP.configure('onerror', function(e) {
    if (active && !simulatedError) {
      throw e;
    }
  });

  var slice = [].slice;
  var template = function() {
    var fragments = slice.call(arguments);

    return _.template(fragments.join(' '), null, {
      interpolate: /\${([\s\S]+?)}/g
    });
  };

  var ActionExpectationFailure = template(
    'Expected component to send an action "${expected}",',
    'but it sent "${actual}".');

  var ActionArgsMismatch = template(
    'Expected component to send an action "${action}"',
    'with arguments: \n${expected},',
    'but it sent:\n${actual}');

  var ReactMatchers = {
    toSendAction: function(util/*, customEqualityTesters*/) {
      return {
        compare: function(callback, options) {
          var actionRc, actionArgs, actionCallIndex;
          var result = {};
          var subject = currentSuite.subject;
          var flush = currentSuite.flush.bind(currentSuite);
          var actionInterceptor = function(original, actionId, actionArgs) {
            var index = ++actionIndex;

            // Ignore actions that we're not tracking:
            if (actionId !== options.action) {
              return original.call(null, actionId, actionArgs);
            }
            // Mark which call to the spy that actually sent our action so we
            // can extract the proper arguments:
            else {
              actionCallIndex = index-1;
            }

            // Simulate the action response:
            subject.lastAction = actionRc;
            subject.setState({ actionIndex: index }, function() {
              if (options.failWith) {
                subject.setProps({
                  storeError: {
                    actionIndex: index,
                    error: options.failWith
                  }
                });
              }
            });

            return actionRc;
          }.bind(this, sendAction);

          simulatedError = active = false;

          // Normalize the options:
          //
          // If #toSendAction() is called with no action identifier, then
          // we're expecting any kind of action to be sent.
          if (!options) {
            options = {};
          }
          // If called with a string, use that as an action identifier.
          else if (typeof options === 'string') {
            options = { action: options };
          }

          // Action result tuning:
          //
          // Action failure simulation:
          if (options.failWith) {
            simulatedError = true;
            actionRc = RSVP.reject(options.failWith);
          }
          // Action success simulation:
          else if (options.succeedWith) {
            actionRc = RSVP.resolve(options.succeedWith);
          }
          // We'll default to the action being successful with no output.
          else {
            actionRc = RSVP.resolve();
          }

          // actionSpy = spyOn(subject, 'sendAction').and.callFake(actionInterceptor);
          actionSpy.and.callFake(actionInterceptor);

          active = true;

          // Execute the callback in the suite's context for niciez.
          callback.call(currentSuite);

          // sendAction() will defer an RSVP promise 99% of the time, flush
          // the backburner queue in case that happens.
          flush();

          active = false;

          result.pass = actionSpy.calls.count() && actionCallIndex !== undefined;

          if (result.pass) {
            actionArgs = actionSpy.calls.argsFor(actionCallIndex);
          }
          else {
            if (options.action) {
              result.message = 'Expected component to send an action "' +
                options.action + '", but it did not.';
            }
            else {
              result.message = 'Expected component to send an action, but it did not.';
            }
          }

          // If an action identifier was specified, we must verify that
          // the component actually sent the action we're expecting.
          if (result.pass && options.action) {
            result.pass = actionArgs[0] === options.action;

            if (!result.pass) {
              result.message = ActionExpectationFailure({
                expected: options.action,
                actual: actionArgs[0]
              });
            }
          }

          if (result.pass && options.args) {
            result.pass = util.equals(actionArgs[1], options.args);

            if (!result.pass) {
              result.message = ActionArgsMismatch({
                action: actionArgs[0],
                expected: JSON.stringify(options.args, null, 2),
                actual: JSON.stringify(actionArgs[1], null, 2)
              });
            }
          }

          return result;
        }
      };
    },

    toExist: function() {
      return {
        compare: function(selector, options) {
          if (typeof selector === 'string') {
            return {
              pass: !!find(selector)
            };
          }
          else if (selector instanceof HTMLElement) {
            return {
              pass: !!selector
            };
          }
          else {
            throw new Error("Unknown type passed to #toExist()");
          }
        }
      }
    }
  };

  return {
    matchers: ReactMatchers,
    install: function(suite, subject) {
      currentSuite = suite;
      jasmine.addMatchers(ReactMatchers);

      if (subject.sendAction) {
        actionIndex = 0;
        sendAction = subject.sendAction;
        actionSpy = spyOn(subject, 'sendAction');
      }
    }
  };
});
define('jasmine_react/dom_helpers',['require','react','jquery'],function(require) {
  var React = require('react');
  var $ = require('jquery');
  var TestUtils = React.addons.TestUtils;
  var Simulate = TestUtils.Simulate;

  var exports = {};
  var helpers = {};
  var subject;

  /**
   * Locate an element inside the component.
   *
   * @param {String} selector
   *        A document.querySelector or jQuery.find() selector.
   *
   * @return {HTMLElement|NilClass}
   */
  var findAll = helpers.findAll = function(selector) {
    return $(subject.getDOMNode()).find(selector);
  };

  /**
   * Locate an element inside the component.
   *
   * @param {String} selector
   *        A document.querySelector or jQuery.find() selector.
   *
   * @return {HTMLElement|NilClass}
   */
  var find = helpers.find = function(selector) {
    return findAll(selector)[0];
  };

  /**
   * Simulate a mouse-click on any HTMLElement.
   */
  helpers.click = function(selector) {
    var node = find(selector);

    if (!node) {
      throw new Error('You are attempting to click on a node that does not exist! Selector: ' + selector);
    }

    return Simulate.click(node);
  };

  helpers.click.$ = function(selector) {
    var node = find(selector);

    helpers.click(selector);
    $(node).click();
  };

  helpers.check = function(selector, isChecked) {
    var node = find(selector);

    if (arguments.length === 1) {
      isChecked = !node.checked;
    }

    $(node).prop('checked', isChecked);
    Simulate.change(node);
  };

  /**
   * Fill in an <input /> with some text.
   */
  helpers.fillIn = function(selector, text) {
    var node = find(selector);
    node.value = text;
  };

  /**
   * Select an option inside a <select /> tag.
   *
   * This helper is compatible with Chosen tags.
   *
   * @param  {String} selector
   * @param  {String} value
   *         The value of the <option /> you want to select.
   */
  helpers.select = function(selector, value) {
    var node = find(selector);
    var $node = $(node);

    $node.find(':selected').prop('selected', false);
    $node.find('[value="' + value + '"]').prop('selected', true);

    if ($node.data('chosen')) {
      $node.trigger('chosen:updated');
    }

    node.value = value;
    Simulate.change(node);
  };

  /**
   * Simulate key-presses to fill in an <input /> with some text.
   *
   * @param {Boolean} [dontReplace=false]
   *        Set to true if you don't want the input's value to be cleared before
   *        modifying it (e.g, append instead of replace.)
   */
  helpers.typeIn = function(selector, text, dontReplace) {
    var i, evt, code, char;
    var node = find(selector);

    node.focus();

    if (!dontReplace) {
      node.value = '';
    }

    for (i = 0; i < text.length; ++i) {
      char = text.charAt(i);
      code = text.charCodeAt(i);

      evt = $.Event('keydown');
      evt.altGraphKey = false;
      evt.altKey = false;
      evt.bubbles = true;
      evt.cancelBubble = false;
      evt.cancelable = true;
      evt.charCode = code;
      evt.clipboardData = undefined;
      evt.ctrlKey = false;
      evt.currentTarget = node;
      evt.defaultPrevented = false;
      evt.detail = 0;
      evt.eventPhase = 2;
      evt.keyCode = code;
      evt.keyIdentifier = char.capitalize();
      evt.keyLocation = 0;
      evt.layerX = 0;
      evt.layerY = 0;
      evt.metaKey = false;
      evt.pageX = 0;
      evt.pageY = 0;
      evt.returnValue = true;
      evt.shiftKey = false;
      evt.srcElement = node;
      evt.target = node;
      evt.type = 'keydown';
      evt.view = window;
      evt.which = code;

      $(node).trigger(evt);

      node.value += char;

      Simulate.change(node);
    }
  };

  /**
   * Expose all the helpers to the global environment.
   *
   * @param {Object} root
   *        The global environment. "this" or "window"
   *
   * @param {React.Component} currentSubject
   *        The mounted instance of the component being tested. All helpers
   *        will be operating on that instance.
   */
  exports.install = function(root, currentSubject) {
    subject = currentSubject;

    Object.keys(helpers).forEach(function(helper) {
      root[helper] = helpers[helper];
    });
  };

  /**
   * Clean up the dirtiness we caused to the global environment.
   *
   * @param  {Object} root
   *         What you passed to #install.
   */
  exports.uninstall = function(root) {
    subject = undefined;

    Object.keys(helpers).forEach(function(helper) {
      delete root[helper];
    });
  };

  exports.helpers = helpers;

  return exports;
});
define('jasmine_react/prop_helpers',['require','rsvp'],function(require) {
  var RSVP = require('rsvp');

  var exports = {};
  var setProps = function(subject, flush, props) {
    var service = RSVP.defer();

    subject.setProps(props, function() {
      service.resolve();
      flush();
    });

    return service.promise;
  };

  var setState = function(subject, flush, state) {
    var service = RSVP.defer();

    subject.setState(state, function() {
      service.resolve();
      flush();
    });

    return service.promise;
  };

  exports.install = function(root, suite, subject) {
    root.setProps = setProps.bind(null, subject, suite.flush.bind(suite));
    root.setState = setState.bind(null, subject, suite.flush.bind(suite));
  };

  exports.uninstall = function(root) {
    delete root.setProps;
    delete root.setState;
  };

  return exports;
});
define('jasmine_react/component_helpers',['require','react','lodash','jquery'],function(require) {
  var React = require('react');
  var _ = require('lodash');
  var $ = require('jquery');

  var extend = _.extend;
  var exports = {};
  var components = [];
  var createComponent = function(rootContainer, global, name, type) {
    var component, className;
    var klass = React.createClass(extend({
      displayName: name,
      render: function() {
        return React.DOM.div({});
      }
    }, type));

    component = {
      name: name,
      type: klass
    };

    // Exports "Hello" to global.helloComponent
    component.globalName = [
      component.name,
      'component'
    ].join('_').underscore().camelize(true);

    // CSS class for the container that houses a component named "Hello" is
    // "hello-fixture"
    className = [
      component.name,
      'fixture'
    ].join('_').underscore().replace(/_/g, '-');

    component.container = $('<div />')
      .addClass(className)
      .appendTo(rootContainer)[0];

    component.instance =
      React.renderComponent(component.type(), component.container);

    global[component.globalName] = component.instance;

    components.push(component);

    return component.instance;
  };

  exports.install = function(global, suite, rootContainer) {
    global.createComponent = createComponent.bind(null, rootContainer, global);
  };

  exports.uninstall = function(global) {
    delete global.createComponent;

    components.forEach(function(component) {
      delete global[component.globalName];
      React.unmountComponentAtNode(component.container);
    });

    components = [];
  };

  return exports;
});
/* global jasmine: false, expect: false */
define('jasmine_react',['require','react','./jasmine_react/matchers','./jasmine_react/dom_helpers','./jasmine_react/prop_helpers','./jasmine_react/component_helpers'],function(require) {
  var React = require('react');
  var Matchers = require('./jasmine_react/matchers');
  var DOMHelpers = require('./jasmine_react/dom_helpers');
  var PropHelpers = require('./jasmine_react/prop_helpers');
  var ComponentHelpers = require('./jasmine_react/component_helpers');
  var startingSearch = window.location.search;

  var exports = jasmine.Suite.prototype;

  /** @internal Used for exposing DOMHelpers into the global context */
  var GLOBAL = this;

  var inspecting = startingSearch.match(/inspect=true/);

  /** @internal */
  var ReactSuite = function(suite, componentType, container, options) {
    suite.promiseSuite = true;
    suite.beforeEach(function() {
      var component = componentType(options.initialProps);
      this.subject = React.renderComponent(component, container);

      Matchers.install(this, this.subject);
      DOMHelpers.install(GLOBAL, this.subject);
      PropHelpers.install(GLOBAL, this, this.subject);
      ComponentHelpers.install(GLOBAL, this, container);
      GLOBAL.subject = this.subject;
    });

    suite.afterEach(function() {
      if (!inspecting) {
        this.subject = GLOBAL.subject = undefined;

        DOMHelpers.uninstall(GLOBAL);
        PropHelpers.uninstall(GLOBAL);
        ComponentHelpers.uninstall(GLOBAL);

        React.unmountComponentAtNode(container);
      }
    });
  };

  /**
   * @class JasmineReact
   *
   * Turn a jasmine Suite into one suitable for testing React components.
   *
   * > WARNING!!!
   * > This requires jasmine.promiseSuite to be available from jasmine-rsvp.
   *
   * @param {Object} options
   *        Options to configure the suite.
   *
   * @param {React.Component} options.type (required)
   *        The component type that you're testing.
   *
   * @param {Object} [options.initialProps={}]
   *        Initial props to create the component with.
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
      container.className = 'fixture';
      container.id = 'jasmine_content';

      if (inspecting) {
        document.body.appendChild(container);
      }
    }

    ReactSuite(this, options.type, container, options);
  };

  return exports.reactSuite;
});
