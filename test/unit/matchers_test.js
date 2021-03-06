define(function(require) {
  var React = require('react');
  var ReactSuite = require('jasmine_react');

  describe('JasmineReact.Matchers', function() {
    describe('@toSendAction', function() {
      var originalSpy;
      var Dispatcher = {
        dispatch: function(evt, args) {}
      };

      beforeEach(function() {
        originalSpy = ReactSuite.config.sendActionSpy;
        ReactSuite.config.getSendActionSpy = function(subject) {
          return {
            original: Dispatcher.dispatch.bind(Dispatcher),
            spy: spyOn(Dispatcher, 'dispatch')
          };
        }
      });

      afterEach(function() {
        ReactSuite.config.sendActionSpy = originalSpy;
      });

      this.reactSuite({
        type: React.createClass({
          render: function() {
            return React.DOM.div({
              children: React.DOM.button({
                onClick: this.doSomething
              }, 'Click me.')
            });
          },

          sendAction: function(evt, args) {
            Dispatcher.dispatch(evt, args);
          },

          doSomething: function(e) {
            e.preventDefault();

            Dispatcher.dispatch('something').then(function() {
              this.setState({ foo: this.props.bar });
            });
          }
        })
      });

      it('should work', function() {
        expect(function() {
          Dispatcher.dispatch('foo');
        }).toSendAction('foo');
      });

      it('should work with arguments', function() {
        expect(function() {
          subject.sendAction('foo', { id: '1' });
        }).toSendAction({
          action: 'foo',
          args: {
            id: '1'
          }
        });
      });

      it('should work with argument mismatch', function() {
        expect(function() {
          subject.sendAction('foo', { id: '2' });
        }).not.toSendAction({
          action: 'foo',
          args: {
            id: '1'
          }
        });
      });

      it('should work with multiple calls', function() {
        expect(function() {
          subject.sendAction('something', { id: '1' });
        }).toSendAction({
          action: 'something',
          args: {
            id: '1'
          }
        });

        expect(function() {
          subject.sendAction('somethingElse');
        }).toSendAction({
          action: 'somethingElse'
        });
      });

      it('should catch and throw handler errors', function() {
        spyOn(console, 'error');

        expect(function() {
          expect(function() {
            click('button');
          }).toSendAction('something');
        }).toThrowError(/Cannot read property 'bar'|evaluating 'this.props.bar'/);
      });

      it('should not intercept other action requests', function() {
        expect(function() {
          subject.sendAction('something');
          subject.sendAction('somethingElse');
        }).toSendAction('something');
      });
    });

    describe('#toExist()', function() {
      var Subject = React.createClass({
        render: function() {
          return React.DOM.div({
            className: 'root-element',
            children: React.DOM.button({
              className: 'btn',
              onClick: this.doSomething
            }, 'Click me.')
          });
        },
      });

      this.reactSuite({
        type: Subject
      });

      it('should work with a selector', function() {
        expect('.btn').toExist();
      });

      it('should work with an HTMLElement', function() {
        expect(find('.btn')).toExist();
      });

      it('should reject anything else', function() {
        expect(function() {
          expect(123).toExist();
        }).toThrowError(/unknown type/i)
      });

      it('should report failures', function() {
        expect('.btnxxx').not.toExist();
      });

      it('should work with the subject element', function() {
        expect('.root-element').toExist();
      });
    });
  });
});