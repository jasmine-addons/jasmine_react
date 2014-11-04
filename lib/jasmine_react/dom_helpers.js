define(function(require) {
  var React = require('react');
  var $ = require('jquery');
  var TestUtils = React.addons.TestUtils;
  var Simulate = TestUtils.Simulate;
  var SimulateNative = TestUtils.SimulateNative;

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
  helpers.click = function(selector, simulateNative) {
    var node = find(selector);

    if (!node) {
      throw new Error('You are attempting to click on a node that does not exist! Selector: ' + selector);
    }

    if (simulateNative === true) {
      return SimulateNative.click(node);
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