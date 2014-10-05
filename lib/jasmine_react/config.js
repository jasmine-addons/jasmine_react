define(function(require) {
  var config = {
    getSendActionSpy: function(subject) {},
    decorateSendActionRc: function(rc) {
      return rc;
    }
  };

  return config;
});