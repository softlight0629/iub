(function() {

	var Base = ServYou.Base;


	function ensureNonEmpty(obj, name, create) {
		var ret = obj[name] || {};
		if (create) {
			obj[name] = ret;
		}
		return ret;
	}

	function AbstractModel(config) {
		AbstractModel.superclass.constructor.call(this, config);
	}

	AbstractModel.ATTRS = {
		isNew: null,

		fetched: false,

		changed: null
	}

	ServYou.extend(AbstractModel, Base);

	ServYou.augment(AbstractModel, {

		fetch: function() {
			var _self = this,
				store = _self.get('store'),
				idAttr = _self.get('idAttr');

			store.read({
				xmodel:_self.get('xmodel'),
				id:_self.get(idAttr)
			}, _self.parse, _self);

			_self.set('fetched', true);
		},

		save: function() {

		},

		isNew: function() {

		},

		isChanged: function() {

		},

		sync: function() {

		},

		toJSON: function() {

		},

		escape: function() {

		},

		parse: function(data, options) {
			var _self = this,
				attrs = _self._self.getAttrs(),
				dataMap = _self.get('dataMap') || {},
				options = options || {},
				attr,
				val;

			for (attr in attrs) {
				if (attr.persist) {
					val = data[dataMap[attr]] || data[attr];
					_self.set(attr, val, options);
				}
			}

		}
	})

})()