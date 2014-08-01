define(function(require) {
  var React = require('react');
  var ReactSuite = require('jasmine_react');
  var GLOBAL = this;
  var Component = React.createClass({
    getDefaultProps: function() {
      return {
        name: ''
      };
    },

    render: function() {
      return React.DOM.div({
        children: React.DOM.span({}, "Hello " + this.props.name)
      });
    }
  });

  describe('JasmineReact.ComponentHelpers', function() {
    this.reactSuite({
      type: Component
    });

    describe('#createComponent', function() {
      it('should work', function() {
        createComponent('Hello', {});

        expect(GLOBAL.helloComponent).toBeTruthy();
        expect(GLOBAL.helloComponent.isMounted()).toBeTruthy();
      });
    });
  });
});