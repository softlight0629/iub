(function() {
	var INVALID = {},
		Observable = ServYou.Observable;

	function ensureNonEmpty(obj, name, create) {
		var ret = obj[name] || {};
		if (create) {
			obj[name] = ret;
		}
		return ret;
	}

	function normalFn(host, method) {
		if (ServYou.isString(method)){
			return host[method];
		}
		return method;
	}

	function __fireAttrChange(self, when, name, prevVal, newVal) {
		var attrName = name;
		return self.fire(when + ServYou.ucfirst(name) + 'Change', {
			attrName: attrName,
			prevVal:prevVal,
			newVal:newVal
		});
	}

	function setInternal(self, name, value, opts, attrs) {
		opts = opts || {};

		var ret, 
			subVal, 
			prevVal;

		prevVal = self.get(name);

		if (!$.isPlainObject(value) && !ServYou.isArray(value) && prevVal === value) {
			return undefined;
		}

		if (!opts['silent']) {
			if (false === __fireAttrChange(self, 'before', name, prevVal, value)) {
				return false;
			}
		}

		ret = self._set(name, value, opts);

		if (ret === false) {
			return ret;
		}

		if (!opts['silent']) {
			value = self.getAttrVals()[name];
			__fireAttrChange(self, 'after', name, prevVal, value);
		}

		return self;
	}

	var Base = function(config) {
		var _self = this,
			c = _self.constructor,
			constructors = [];

		Observable.apply(this, arguments);

		while(c) {
			constructors.push(c);

			c = c.superclass ? c.superclass.constructor : null;
		}

		for (var i = constructors.length - 1; i >= 0; i--) {
			_self.addAttrs(constructors[i]['ATTRS'], true);
		}

		_self._initAttrs(config);
	}

	Base.INVALID = INVALID;

	ServYou.extend(Base, Observable);

	ServYou.augment(Base, 
	{
		addAttr: function(name, attrConfig, overrides) {
			var _self = this,
				attrs = _self.getAttrs(),
				cfg = ServYou.cloneObject(attrConfig);

			if (!attrs[name]) {
				attrs[name] = cfg;
			} else if (overrides) {
				ServYou.mix(true, attrs[name], cfg);
			}

			return _self;
		},

		addAttrs: function(attrConfigs, initialValues, overrides) {
			var _self = this;

			if (!attrConfigs) {
				return _self;
			}

			if (typeof initialValues === 'boolean') {
				overrides = initialValues;
				initialValues = null;
			}

			ServYou.each(attrConfigs, function(attrConfig, name) {
				_self.addAttr(name, attrConfig, overrides);
			});

			if (initialValues) {
				_self.set(initialValues);
			}

			return _self;

		},

		hasAttr: function(name) {
			return name && this.getAttrs().hasOwnProperty(name);
		},

		getAttrs: function() {
			return ensureNonEmpty(this, '__attrs', true);
		},

		getAttrVals: function() {
			return ensureNonEmpty(this, '__attrVals', true);
		},

		get: function(name) {
			var _self = this,
				declared = _self.hasAttr(name),
				attrVals = _self.getAttrVals(),
				attrConfig,
				getter,
				ret;

			attrConfig = ensureNonEmpty(_self.getAttrs(), name);
			getter = attrConfig['getter'];

			ret = name in attrVals ? 
				attrVals[name] : 
				_self._getDefAttrVal(name);

			if (getter && (getter = normalFn(_self, getter))) {
				ret = getter.call(_self, ret, name);
			}

			return ret;
		},

		clearAttrVals: function() {
			this.__attrVals = {};
		},

		removeAttr: function(name) {
			var _self = this;

			if (_self.hasAttr(name)) {
				delete _self.getAttrs()[name];
				delete _self.getAttrVals()[name];
			}

			return _self;
		},

		set: function(name, value, opts) {
			var _self = this;

			if ($.isPlainObject(name)) {
				opts = value;
				var all = Object(name),
					attrs = [];

				for (name in all) {
					if (all.hasOwnProperty(name)) {
						setInternal(_self, name, all[name], opts);
					}
				}
				return _self
			}

			return setInternal(_self, name, value, opts);
		},

		setInternal: function(name, value, opts) {
			return this._set(name, value, opts);
		},

		_getDefAttrVal: function(name) {
			var _self = this,
			    attrs = _self.getAttrs(),
				attrConfig = ensureNonEmpty(attrs, name),
				valFn = attrConfig.valueFn,
				val;

			if (valFn && (valFn = normalFn(_self, valFn))) {
				val = valFn.call(_self);
				if (val !== undefined) {
					attrConfig.value = val;
				}
				delete attrConfig.valueFn;
				attrs[name] = attrConfig;
			}

			return attrConfig.value;
		},

		// READ
		_set: function(name, value, opts) {
			var _self = this, setValue,
				attrConfig = ensureNonEmpty(_self.getAttrs(), name, true),
				setter = attrConfig['setter'];

			if (setter && (setter = normalFn(_self, setter))) {
				setValue = setter.call(_self, value, name);
			}

			if (setValue === INVALID) {
				return false;
			}

			if (setValue !== undefined) {
				value = setValue;
			}

			_self.getAttrVals()[name] = value;


		},

		_initAttrs: function(config) {
			var _self = this;

			if (config) {
				for (var attr in config) {
					if (config.hasOwnProperty(attr)) {
						_self._set(attr, config[attr]);
					}
				}
			}
		}
	})

	ServYou.Base = Base;
})()