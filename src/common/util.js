
var ServYou = ServYou || {};

(function() {

	var toString = Object.prototype.toString;

	$.extend(ServYou, 
	{
		isFunction: function(fn) {
			return typeof(fn) === "function";
		},

		isArray: function(arr) {
			return toString.call(arr) === "[object Array]";
		},

		isNumber: function(number) {
			return toString.call(number) === "[object Number]";
		},

		isString: function(str) {
			return toString.call(str) === "[object String]";
		},

		isDate: function(date) {
			return toString.call(date) === "[object Date"];
		},

		namespace: function(name, baseName) {
			var baseName = baseName || ServYou;

			if (!name) {
				return ServYou;
			}

			var list = name.split('.'),
				curNs = baseName;

			for (var i = 0; i < list.length; i++) {
				var nsName = list[i];
				if (!curNs[nsName]) {
					curNs[nsName] = {};
				}
				curNs = curNs[nsName];
			}

			return curNs;
		},

		app: function(name) {
			if (!window[name]) {
				window[name] = {
					namespace : function(nsName) {
						return ServYou.namespace(nsName, window[name]);
					}
				}
			}
		},

		cloneObject: function() {

		},

		extend: function(subclass, superclass, overrides, staticOverrides) {

			if (!ServYou.isFunction(superclass)) {
				superclass = subclass;
				overrides = superclass;
				subclass = function() {}
			}

			var create = Object.create ?
				function (proto, subclass) {
					return Object.create(proto, 
					{
						constructor:{
							value: subclass
						}
					})
				} :

				function(proto, subclass) {
					function F(){};
					F.prototype = proto;
					subclass.prototype = new F();
					subclass.constructor = subclass;
				}

			var superObj = create(superclass.prototype, subclass);
			subclass.prototype = ServYou.mix(superObj, subclass.prototype);
			subclass.superclass = create(superclass.prototype, superclass);

			ServYou.mix(superObj, overrides);
			ServYou.mix(subclass, staticOverrides);

			return subclass;

		},

		mix: function() {

		},

		merge: function() {

		},

		mixin: function() {

		}

	})
})()