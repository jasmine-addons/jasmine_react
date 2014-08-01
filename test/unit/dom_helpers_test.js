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

    describe('#check', function() {
      this.reactSuite({
        type: React.createClass({
          mixins: [ React.addons.LinkedStateMixin ],

          getInitialState: function() {
            return {
              categories: []
            };
          },

          render: function() {
            return React.DOM.div({
              children: ['Food', 'Shopping', 'Disco'].map(function(category) {
                var isChecked = this.state.categories.indexOf(category) > -1;

                return React.DOM.label({
                  key: category,
                  children: [
                    React.DOM.input({
                      type: 'checkbox',
                      onChange: this.addCategory,
                      checked: isChecked,
                      value: category
                    }),

                    React.DOM.span({}, category),
                  ]
                });
              }.bind(this))
            });
          },

          addCategory: function(e) {
            var isChecked = e.target.checked;
            var categories = [].concat(this.state.categories);
            var category = e.target.value;

            if (!isChecked) {
              if (categories.indexOf(category) > -1) {
                categories.splice(categories.indexOf(category), 1);
              }
            }
            else {
              if (categories.indexOf(category) === -1) {
                categories.push(category);
              }
            }

            this.setState({
              categories: categories
            });
          }
        })
      });

      it('should work', function() {
        check('[value="Food"]');
        expect(subject.state.categories).toEqual(['Food']);
        expect(find('[value="Food"]').checked).toBe(true);
      });
    })
  });
});