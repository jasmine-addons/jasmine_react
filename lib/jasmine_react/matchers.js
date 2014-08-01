/* global jasmine: false */
define(function(require) {
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