# jasmine_react

Turn a jasmine Suite into one suitable for testing React components.

Example:

```javascript
var Checkbox = require('jsx!components/checkbox');

describe('Components.Checkbox', function() {
    this.reactSuite({ type: Checkbox });

    it('should render', function() {
        expect(subject.isMounted()).toBeTruthy();
    });
});
```

## Features

The following features will become available to your suite:

### Automatic component (un)mounting

In your global suite context, "subject" will contain a reference to the
_mounted_ instance of the component you're testing, created and mounted
during each test in your suite.

### DOM helpers

All the DOM helpers detailed below are injected into the global context throughout your tests, so you can conveniently use things like `find()` and `click()`.

> **Note**
> 
> Most of these helpers operate on nodes *inside* the node of the component 
> being tested, so when you do `find('.foo')` it will look for a child
> that has the `foo` class only inside the mounted component instance.


#### find(selector)

Locate a single element using a jQuery-compatible selector. Returns an `HTMLElement` if found.

```javascript
it('should show a link', function() {
  expect(find('a:contains("My Link Text")').length).toBe(1);
});
```

#### findAll(selector)

Like `find()` but returns a set of all elements that match the selector.

#### click(selector)

Simulate a mouse-click. If a selector was passed in and it did not yield an element, an error will be thrown.

```javascript
it('should track clicks', function() {
  click('button');
  expect(subject.state.clickCount).toBe(1);
});
```

#### check(selector[, isChecked])

Toggle the `checked` state of a radio button or a checkbox. You can explicitly set the state by passing `true` or `false` as the second parameter.

```javascript
it('should track the mute-sound preference', function() {
    check(':contains("Mute Sounds")', true);
    expect(subject.state.muteSound).toBe(true);
});
```

#### select(selector, value)

Choose an option from a `<select />` dropdown menu. The value parameter should map to the `<option />` element you want to choose.

There is currently no support for multiple-option dropdowns.

```javascript
it('should choose my primary currency', function() {
    select('[name="currency"]', 'JOD');
    expect(subject.state.currency).toEqual('JOD');
});
```

#### fillIn(selector, text)

Change a text-input field's value. This does not simulate typing, the `typeIn` helper does that instead.

```javascript
it('should track my favorite colour', function() {
    fillIn('[name="colour"]', 'banana');
    expect(subject.state.colour).toEqual('banana');
});
```

#### typeIn(selector, text[, dontReplace])

Simulate typing into a text field. 

Typing in will change the node's `value`, emit the `change` event, along with a `keydown` event for every character in the text.

```javascript
it('should limit text to 10 chars', function() {
    typeIn('input', 'hello you should not cut me off really its not nice');
    expect(subject.state.text).toEqual('hello you');
});
```

### Prop helpers

> WARNING!!!
> 
> This requires jasmine.promiseSuite to be available from
> [jasmine_rsvp](https://github.com/amireh/jasmine-rsvp).

#### setProps(newProps)

Update the component props. Returns an `RSVP.Promise` that fulfills when the component has been re-rendered with the new props.

```javascript
it('should render the name', function() {
    expect(find('span.name').innerText).toEqual('');

    setProps({
        name: 'Ahmad'
    });

    expect(find('span.name').innerText).toEqual('Ahmad');
});
```

#### setState(newState)

Similar to `#setProps()` but for the component's internal state, which generally you should avoid touching.

### Custom matchers

#### `toExist()`

Shortcut for testing that a certain element exists in the DOM.

```javascript
// Instead of:
expect(findAll('.something').length).toEqual(1)

// You can do:
expect('.something').toExist();
```

#### Action testing using `toSendAction(nameOrOptions)`

> WARNING!!!
> 
> This requires jasmine.promiseSuite to be available from
> [jasmine_rsvp](https://github.com/amireh/jasmine-rsvp).

This is very opinionated and most likely won't apply to your code, but it does to mine so it's here. My components are glued to only "emit" actions when there's any sort of processing required. This allows me to decouple the UI (components) from actual domain logic handling, and consequently, it makes testing component interaction pretty slick.

To test if a component is sending actions correctly, a custom matcher
is exposed to your suite, called `toSendAction()`. The matcher accepts either a string, which would be the event such as `user:signup`, or `account:save`, or a more descriptive object (see below.)

Example:

```javascript
it("should totally remove one's account when clicking the red button", function() {
  expect(function() {
    click('#the_red_button');
  }).toSendAction('users:unregister');
});
```

Example 2: verifying the correct parameters are being sent.

We can also test the parameters the component is sending. Let's assume we have a `Preferences` component that sends the `updatePreferences` action
with the user's chosen preferences.

```jsx
var Preferences = React.createClass({
    render: function() {
        return (
            <form>
                <select ref="weekday">
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                </select>
                <button id="save">Save</button>
            </form>
        );
    },

    onClick: function() {
        this.sendAction('updatePreferences', {
            weekday: this.refs.weekday.value
        });
    }
});
```

If the user chooses Friday to be their starting day of the week, the component should emit the right action with that weekday:

```javascript
it("set the prefered starting weekday", function() {
    expect(function() {
        select('[name="weekday"]', 'Friday');
        click('#save');
    }).toSendAction({
        action: 'updatePreferences',
        args: {
            weekday: 'friday'
        }
    });
});
```

## License

MIT