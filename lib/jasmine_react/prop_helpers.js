define(function(require) {
  var RSVP = require('rsvp');

  var exports = {};
  var setProps = function(subject, flush, props) {
    var service = RSVP.defer();

    subject.setProps(props, function() {
      service.resolve();
      flush();
    });

    return service.promise;
  };

  var setState = function(subject, flush, state) {
    var service = RSVP.defer();

    subject.setState(state, function() {
      service.resolve();
      flush();
    });

    return service.promise;
  };

  exports.install = function(root, suite, subject) {
    root.setProps = setProps.bind(null, subject, suite.flush.bind(suite));
    root.setState = setState.bind(null, subject, suite.flush.bind(suite));
  };

  exports.uninstall = function(root) {
    delete root.setProps;
    delete root.setState;
  };

  return exports;
});