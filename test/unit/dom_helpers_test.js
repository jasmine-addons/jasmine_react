define(function(require) {
  var React = require('react');
  var ReactSuite = require('jasmine_react');

  describe('JasmineReact.DOMHelpers', function() {
    describe('#typeIn', function() {
      this.reactSuite({
        type: React.createClass({
          mixins: [ React.addons.LinkedStateMixin ],
          getInitialState: function() {
            return {
              name: null
            };
          },

          render: function() {
            return React.DOM.div({
              children: [
                React.DOM.input({
                  name: "name",
                  valueLink: this.linkState('name')
                })
              ]
            });
          }
        })
      });

      it('should work', function() {
        typeIn('[name="name"]', 'Ahmad');
        expect(find('[name="name"]').value).toEqual('Ahmad');
        expect(subject.state.name).toEqual('Ahmad');
      });
    });

    describe('#select', function() {
      this.reactSuite({
        type: React.createClass({
          mixins: [ React.addons.LinkedStateMixin ],
          getInitialState: function() {
            return {
              currency: null
            };
          },

          render: function() {
            return React.DOM.div({
              children: [
                React.DOM.select({
                  name: "currency",
                  valueLink: this.linkState('currency'),
                  children: ['EUR', 'JOD', 'USD'].map(function(currency) {
                    return React.DOM.option({
                      value: currency,
                      children: currency
                    });
                  })
                })
              ]
            });
          }
        })
      });

      it('should work', function() {
        setState({ currency: 'USD' });
        select('[name="currency"]', 'JOD');
        expect(subject.state.currency).toEqual('JOD');
      });
    });
  });
});