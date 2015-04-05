var Dataz = require('../'),
	assert = require('assert');

describe('Dataz', function() {

	var d;
	beforeEach(function() {
		d = new Dataz();
	});

	describe('extend', function() {

		it('should correctly setup inheritance', function() {
			var Sub = Dataz.extend();
			assert(typeof Sub.prototype.get === 'function');
			assert(typeof Sub.prototype.set === 'function');
			assert(typeof Sub.prototype.extend === 'function');
			assert(typeof Sub.prototype.merge === 'function');
			assert(typeof Sub.prototype.toJSON === 'function');

			var s = new Sub();
			assert(s instanceof Sub);
			assert(s instanceof Dataz);
		});

		it('should merge defaults in sub classes', function() {
			var Sub = Dataz.extend({
				defaults: {
					delimiter: '.',
					foo: 'bar'
				}
			});
			assert(typeof Sub.defaults === 'object');
			assert(Sub.defaults.delimiter === '.');
			assert(Sub.defaults.foo === 'bar');
			assert(Sub.defaults.data === null);
		});
		
		it('should propogate the extend static method', function() {
			var Sub = Dataz.extend();
			var SubSub = Sub.extend();
			assert(typeof SubSub.extend === 'function');
		});

		it('should call the super constructor in a sub class', function() {
			called = false;
			var Sub = Dataz.extend({
				constructor: function() {
					called = true;
				}
			});
			var SubSub = Sub.extend();
			new SubSub();
			assert(called);
		});

		it('should merge the options from parent classes', function() {
			var Sub = Dataz.extend({
				defaults: {
					foo: 'bar'
				}
			});
			var s = new Sub({
				baz: 'far'
			});
			assert(typeof s.options === 'object');
			assert(s.options.delimiter === ':');
			assert(s.options.foo === 'bar');
			assert(s.options.baz === 'far');
		});

		it('should merge prototypes from parents', function() {
			var Sub = Dataz.extend({
				prototype: {
					foo: function() {}
				}
			});
			assert(typeof Sub.prototype.foo === 'function');
			var s = new Sub();
			assert(typeof s.foo === 'function');
		});

	});
	
	describe('set()', function() {

		it('should set values at a given key', function() {
			d.set('foo', 'bar');
			assert(d.data.foo, 'Did not set the key');
			assert(d.data.foo === 'bar', 'Did not set the key to the right value');
		});

		it('should set the entire data object', function() {
			d.set({ foo: 'bar' });
			assert(d.data.foo, 'Did not set the key');
			assert(d.data.foo === 'bar', 'Did not set the key to the right value');
		});

		it('should deep set a key', function() {
			d.set('foo:bar', 'baz');
			assert(typeof d.data.foo === 'object', 'Did not create the parent objects');
			assert(d.data.foo.bar === 'baz', 'Did not set the right value');

			d.set('foo:far:raz', 'oof');
			assert(typeof d.data.foo === 'object', 'Did not create the parent objects');
			assert(typeof d.data.foo.far === 'object', 'Did not create the parent objects');
			assert(d.data.foo.bar === 'baz', 'Overrode an existing value');
			assert(d.data.foo.far.raz === 'oof', 'Did not set the right value');
		});

	});

	describe('get()', function() {

		it('should get a value that has been set', function() {
			d.set('foo', 'bar');
			assert(d.get('foo') === 'bar');
		});

		it('should return the entire data object when called without a key', function() {
			d.set('foo', 'bar');
			var o = d.get();
			assert(typeof o === 'object');
			assert(o.foo === 'bar');
		});

		it('should return null when getting on a key that doesn\'t exist', function() {
			assert(d.get('foo') === null);
			assert(d.get('foo:bar') === null);
		});

		it('should get deeply nested keys exist', function() {
			d.set('foo:bar', 'baz');
			assert(typeof d.get('foo') === 'object');
			assert(d.get('foo:bar') === 'baz');
		});

	});

	describe('Helpers: extend(), merge(), toJSON()', function() {

		it('should shallowly extend the data', function() {
			// Merge all keys
			d.set('foo', 'bar');
			d.extend({
				baz: 'boo'
			});
			assert(d.get('foo') === 'bar');
			assert(d.get('baz') === 'boo');

			// Override existing keys
			d.extend({
				baz: 'foz'
			});
			assert(d.get('baz') === 'foz');

			// Shallow extend objects
			d.extend({
				boz: {
					foo: 'bar'
				}
			});
			assert(d.get('boz:foo') === 'bar');
			d.extend({
				boz: {
					bar: 'foo'
				}
			});
			assert(d.get('boz:foo') === null);
			assert(d.get('boz:bar') === 'foo');
		});

		it('should deeply merge the data', function() {
			// Merge all keys
			d.set('foo', 'bar');
			d.merge({
				baz: 'boo'
			});
			assert(d.get('foo') === 'bar');
			assert(d.get('baz') === 'boo');

			// Override existing keys
			d.merge({
				baz: 'foz'
			});
			assert(d.get('baz') === 'foz');

			// Deeply merge objects
			d.merge({
				boz: {
					foo: 'bar'
				}
			});
			assert(d.get('boz:foo') === 'bar');
			d.merge({
				boz: {
					bar: 'foo'
				}
			});
			assert(d.get('boz:foo') === 'bar');
			assert(d.get('boz:bar') === 'foo');
		});

		it('should export the data to json', function() {
			d.set({
				foo: 'bar',
				baz: 'far'
			});
			assert(d.toJSON().foo === 'bar');
			assert(d.toJSON().baz === 'far');
			assert(d.toJSON(true) === '{"foo":"bar","baz":"far"}');
		});
		
	});

	describe('Escape/Unescape', function() {

		it('should escape data', function() {
			d.set({
				foo: 'My <span>html</span> string.'
			});
			assert(d.escape().foo === 'My &lt;span&gt;html&lt;/span&gt; string.');
		});

		it('should unescape and set data', function() {
			d.unescapeSet({
				foo: 'My &lt;span&gt;html&lt;/span&gt; string.'
			});
			assert(d.toJSON().foo === 'My <span>html</span> string.');
		});

	});
});

