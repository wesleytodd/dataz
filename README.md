# Dataz

For dealing with all the dataz.  Provides helpers for safely dealing with nested data structures.  This is intended to be used as a base class for wrapping any arbitrary data so you can easily and safely get and set on nested data structures.  This is for you if you are tired of writing lines like this:

```javascript
if (obj && obj.foo && obj.foo.bar && obj.foo.bar.baz) {
	// do something with obj.foo.bar.baz
}
```

Now you can just do:

```javascript
var d = new Dataz({
	data: {
		foo: {
			bar: {
				baz: 'fooBarBaz'
			}
		}
	}
});
d.get('foo:bar:baz:missing'); // null
d.get('foo:bar:baz'); // 'fooBarBaz'
d.get('foo:bar'); // {baz:'fooBarBaz'}
d.get('foo'); // {bar:{baz:'fooBarBaz'}}
d.get(); // {foo:{bar:{baz:'fooBarBaz'}}}
```

An instance of the data class also has safe setters:

```javascript
var d = new Dataz();
d.set('foo:bar:baz', 'fooBarBaz');
d.get('foo:bar:baz'); // 'fooBarBaz'
```

There are also a few helper methods to make operating on the data easy and simple:

```javascript
var d = new Dataz({
	data: {
		foo: 'bar'
	}
});

// Shallow merge
d.extend({
	baz: 'far',
});
d.get(); // {foo: 'bar', 'baz': 'far'}

// Deep merge
d.set('baz', {
	far: 'bazFar'
});
d.merge({
	foo: 'foo',
	baz: {
		far: 'far',
		bar: 'bar'
	}
});
d.get(); // {foo: 'foo', 'baz': {far: 'far', bar: 'bar'}}

// Output for json
d.toJSON(); // {foo: 'foo', baz: {far: 'far', bar: 'bar'}}
d.toJSON(true); // '{"foo":"foo","baz":{"far":"far","bar":"bar"}}'
```
