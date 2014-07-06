module.exports = {
  main: {
    src: [ 'lib/pixy' ],
    dest: 'doc/api',
    options: {
      'title': 'Pixy.js Reference',
      'builtin-classes': false,
      'color': true,
      'no-source': true,
      'tests': false,
      'processes': 1,
      'guides': 'doc/guides.json',
      'images': 'doc/images',
      'head-html': 'doc/head.html',
      'warnings': [],
      'external': [
        'jQuery',
        'jQuery.Event',
        '$',
        '_'
      ]
    }
  }
};