module.exports = {
  version: {
    files: {
      "lib/<%= grunt.config.get('pkg.name') %>/version.js": "lib/<%= grunt.config.get('pkg.name') %>/version.js",
    },
    options: {
      replacements: [{
        pattern: /\d\.\d{1,}\.\d+/,
        replacement: "<%= grunt.config.get('pkg.version') %>"
      }]
    }
  }
};