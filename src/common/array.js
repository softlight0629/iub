(function() {

	ServYou.Array = {

		peek : function(array) {
			return array[array.length - 1];
		},

		indexOf : function(value, array, opt_fromIndex) {
			var fromIndex = opt_fromIndex == null ?
				0 : (opt_fromIndex < 0) ?
				Math.max(0, array.length + opt_fromIndex) : opt_fromIndex;

			for (var i = fromIndex; i < array.length; i++) {
				if (i in array && array[i] === value) {
					return i;
				}
			}

			return -1;
		},

		contains: function(value, array) {
			return ServYou.Array.indexOf(value, array) >= 0;
		},

		each : ServYou.each,

		equals: function(a1, a2) {
			if (a1 == a2) {
				return true;
			}

			if (!a1 || !a2) {
				return false;
			}

			if (a1.length != a2.length) {
				return false;
			}

			var rst = true;
			for (var i = 0; i < a1.length; i++) {
				if (a1[i] !== a2[i]) {
					rst = false;
					break;
				}
			}

			return rst;
		},

		filter : function(array, func) {
			var results = [];
			ServYou.Array.each(array, function(value, index) {
				if (func(value, index)) {
					results.push(value);
				}
			})

			return results;
		},

		map : function(array, func) {
			var results = [];
			ServYou.Array.each(array, function(value, index) {
				results.push(func(value, index));
			});
			return results;
		},

		find : function(array, func) {
			var i = ServYou.Array.findIndex(array, func);
			return  i < 0 ? null : array[i];
		},

		findIndex : function(array, func) {
			var result = -1;
			ServYou.Array.each(array, function(value, index) {
				if (func(value, index)) {
					result = index;
					return false;
				}
			});
			return result;
		},

		isEmpty : function(array) {
			return array.length == 0;
		},

		add : function(array, value) {
			array.push(value);
		},

		addAt : function(array, value, index) {
			ServYou.Array.splice(array, index, 0, value);
		},

		empty : function(array) {
			if (!(array instanceof(Array))) {
				for (var i = array.length - 1; i >= 0; i--) {
					delete array[i];
				}
			}

			array.length = 0;
		},

		remove : function(array, value) {
			var i = ServYou.Array.indexOf(value, array);
			var rv;

			if ((rv = i >= 0)) {
				ServYou.Array.removeAt(array, i);
			}
			return rv;
		},

		removeAt : function(array, index) {
			return ServYou.Array.splice(array, index, 1).length == 1;
		},

		slice : function(arr, start, opt_end) {
			if (arguments.length <= 2) {
				return Array.prototype.slice.call(arr, start);
			} else {
				return Array.prototype.slice.call(arr, start, opt_end);
			}
		},

		splice : function(arr, index, howMany, var_args) {
			return Array.prototype.slice.apply(arr, ServYou.Array.slice(arguments, 1))
		}
 	}


})()