# jasmine_react

Turn a jasmine Suite into one suitable for testing React components.

> WARNING!!!
> This requires jasmine.promiseSuite to be available from [jasmine_rsvp](https://github.com/amireh/jasmine_rsvp).

Example:

```javascript
define(function(require) {
    var Checkbox = require('jsx!components/checkbox');

    describe('Components.Checkbox', function() {
      this.reactSuite({ type: Checkbox });
    });
});
```

## Features

The following features will become available to your suite:

### React Test Helpers

All the React test helpers are injected into the global context throughout
your tests, so you can conveniently use things like `find()` and `click()`.

Example:

```javascript
it('should show a link', function() {
  expect(find('a:contains("My Link Text")').length).toBe(1);
});
```

See JasmineReact.DOMHelpers for more info on what's available.

### Automatic component (un)mounting

In your global suite context, "subject" will contain a reference to the
_mounted_ instance of the component you're testing, created and mounted
during each test in your suite.

### Action testing

To test if your component is sending actions correctly, a custom matcher
is exposed to your suite, called #toSendAction.

See the corresponding docs for more info on the matcher.

Example:

```javascript
it('should send an action', function() {
  expect(function() {
    click('.my-button');
  }).toSendAction('users:destroyAccount');
});
```

## License

MIT