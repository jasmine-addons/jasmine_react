/* global jasmine: false */
define(function(require) {
  var React = require('react');
  var $ = require('jquery');
  var TestUtils = React.addons.TestUtils;
  var Simulate = TestUtils.Simulate;

  var exports = {};
  var subject;

  var find = function(selector) {
    return $(subject.getDOMNode()).find(selector)[0];
  };

  exports.find = function(selector) {
    return $(find(selector));
  };

  exports.click = function(selector) {
    return Simulate.click(find(selector));
  };

  exports.fillIn = function(selector, text) {
    var node = find(selector);
    node.value = text;
  };

  exports.typeIn = function(selector, text) {
    var node = find(selector);
    var i;

    node.focus();
    Simulate.focus(node);

    for (i = 0; i < text.length; ++i) {
      console.debug('Pressing:', text.charAt(i))
      Simulate.keyUp(node, {
        key: text.charAt(i).capitalize(),
        which: text.charCodeAt(i)
      });
    }
  };

  exports.setSubject = function(inSubject) {
    subject = inSubject;
  };

  return exports;
});