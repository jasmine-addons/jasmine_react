define(function(require) {
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
  var find = helpers.find = function(selector) {
    return $(subject.getDOMNode()).find(selector)[0];
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

  /**
   * Fill in an <input /> with some text.
   */
  helpers.fillIn = function(selector, text) {
    var node = find(selector);
    node.value = text;
  };

  /**
   * Simulate key-presses to fill in an <input /> with some text.
   */
  helpers.typeIn = function(selector, text) {
    var node = find(selector);
    var i;

    node.focus();
    Simulate.focus(node);

    for (i = 0; i < text.length; ++i) {
      console.debug('Pressing:', text.charAt(i));
      Simulate.keyUp(node, {
        key: text.charAt(i).capitalize(),
        which: text.charCodeAt(i)
      });
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