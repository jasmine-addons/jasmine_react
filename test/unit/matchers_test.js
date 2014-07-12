define(function(require) {
  var React = require('react');
  var ReactSuite = require('jasmine_react');

  describe('JasmineReact.Matchers', function() {
    describe('@toSendAction', function() {
      this.reactSuite({
        type: React.createClass({
          render: function() {
            return React.DOM.div({
              children: React.DOM.button({
                onClick: this.doSomething
              }, 'Click me.')
            });
          },

          sendAction: function() {
            // stub ...
          },

          doSomething: function(e) {
            e.preventDefault();

            this.sendAction('something').then(function() {
              this.setState({ foo: this.props.bar });
            });
          }
        })
      });

      it('should catch and throw handler errors', function() {
        spyOn(console, 'error');

        expect(function() {
          expect(function() {
            click('button');
          }).toSendAction('something');
        }).toThrowError(/Cannot read property 'bar'|evaluating 'this.props.bar'/);
      });
    });
  });
});