define(function(require) {
  var React = require('react');
  var ReactSuite = require('jasmine_react');
  var Component = React.createClass({
    getDefaultProps: function() {
      return {
        name: ''
      };
    }
    ,
    render: function() {
      return React.DOM.div({
        children: React.DOM.span({}, "Hello " + this.props.name)
      });
    }
  });

  describe('jasmine.Suite.reactSuite', function() {
    this.reactSuite({
      type: Component
    });

    it('should work', function() {});
    it('should expose DOM helpers as globals', function() {
      expect(typeof find).toEqual('function');
      expect(typeof click).toEqual('function');
    });

    it('should expose tested component to "this.subject"', function() {
      expect(this.subject).toBeTruthy();
    });

    it('should expose a global "subject"', function() {
      expect(this.subject).toEqual(subject);
    });

    it('should mount tested component', function() {
      expect(this.subject.isMounted()).toBeTruthy();
    });

    describe('#setProps', function() {
      it('should work', function() {
        setProps({ name: 'Ahmad' });
        expect(find('span').innerText).toEqual('Hello Ahmad');

        setProps({ name: 'Zaid' });
        expect(find('span').innerText).toEqual('Hello Zaid');
      });
    });
  });
});