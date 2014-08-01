define(function(require) {
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