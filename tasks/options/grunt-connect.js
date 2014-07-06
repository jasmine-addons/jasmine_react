module.exports = {
  tests: {
    options: {
      keepalive: false,
      port: 10113
    }
  },

  docs: {
    options: {
      keepalive: true,
      port: 10114,
      base: "doc"
    }
  }
};
