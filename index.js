var _defaults = require('lodash.defaults'),
	_assign = require('lodash.assign'),
	_merge = require('lodash.merge'),
	_noop = require('lodash.noop'),
	_create = require('lodash.create'),
	EventEmitter = require('events').EventEmitter;

var Dataz = module.exports = function(options) {
	// Merge the options
	this.options = _defaults(options || {}, Dataz.defaults);

	// The data we represent
	this.data = this.options.data || {};
};

// Extends from event emitter
Dataz.prototype = _create(EventEmitter.prototype, {constructor: Dataz});

Dataz.defaults = {
	delimiter: ':',
	data: null,
	emitChangeEvents: true
};

Dataz.extend = function(options) {
	var Super = this;

	options = _defaults(options || {}, {
		callSuper: true,
		constructor: _noop,
		prototype: {},
		defaults: {}
	});

	// Constructor
	var SubClass = (options.callSuper) ? function(opts) {
		// Merge the options with the defaults
		opts = _defaults(opts || {}, SubClass.defaults);

		// Call the super constructor
		Super.call(this, opts);

		// Call our constructor function
		options.constructor.call(this, opts);
	} : options.constructor;
		
	// Extend the prototype
	SubClass.prototype = _create(Super.prototype, _assign(options.prototype, {constructor: SubClass}));

	// Add the extend method
	SubClass.extend = Dataz.extend.bind(SubClass);

	// Setup default options
	SubClass.defaults = _defaults(options.defaults, Super.defaults);

	return SubClass;
};

Dataz.prototype.get = function(key) {
	if (!key) {
		return this.data;
	}

	var k = key.split(this.options.delimiter),
		o = this.data;

	for (var i = 0; i < k.length; i++) {
		if (typeof o[k[i]] === 'undefined') {
			return null;
		}
		o = o[k[i]];
	}
	return o;
};

Dataz.prototype.set = function(key, val) {
	if (typeof val === 'undefined') {
		return this.data = key;
	}

	var k = key.split(this.options.delimiter),
		o = this.data;

	for (var i = 0; i < k.length; i++) {
		if (i === k.length - 1) {
			var _prev = o[k[i]];
			o[k[i]] = val;
			if (this.options.emitChangeEvents) {
				this.emit('change', key, o[k[i]], _prev);
			}
		} else if (typeof o[k[i]] === 'undefined') {
			o[k[i]] = {};
		}
		o = o[k[i]];
	}
	return o;
};

Dataz.prototype.extend = function() {
	var args = Array.prototype.slice.call(arguments);
	args.unshift(this.data);
	return _assign.apply(null, args);
};

Dataz.prototype.merge = function() {
	var args = Array.prototype.slice.call(arguments);
	args.unshift(this.data);
	return _merge.apply(null, args);
};

Dataz.prototype.toJSON = function(stringify) {
	return stringify ? JSON.stringify(this.data) : this.data;
};
