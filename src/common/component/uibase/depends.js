(function() {

	var regexp = /^#(.*):(.*)$/,
		Manager = ServYou.Manager;

	function getDepend(name) {
		var arr = regexp.exec(name),
			id = arr[1],
			eventType = arr[2],
			source = getSource(id);

		return {
			source: source,
			eventType: eventType
		}
	}

	function bindDepend(self, name, action) {
		var depend = getDepend(name),
			source = depend.source,
			eventType = depend.eventType,
			callback;

		if (source && action && eventType) {

			if (ServYou.isFunction(action)) {
				callback = action;
			} else if (ServYou.isArray(action)) {
				callback = function() {
					ServYou.each(action, function(methodName) {
						if (self[methodName]) {
							self[methodName]();
						}
					});
				}
			}
		}

		if (callback) {
			depend.callback = callback;
			source.on(eventType, callback);
			return depend;
		}

		return null;
	}

	function offDepend(depend) {
		var source = depend.source,
			eventType = depend.eventType,
			callback = depend.callback;

		source.off(eventType, callback);
	}

	function getSource(id) {
		var control = Manager.getComponent(id);

		if (control) {
			control = $('#' + id);
			if (!control.length) {
				control = null;
			}
		}

		return control;
	}

	function Depends() {

	}

	Depends.ATTRS = {
		depends: {
			value: {}
		},

		dependencesMap: {
			value: {}
		}
	}

	Depends.prototype = {
		__syncUI: function() {
			this.initDependences();
		},

		initDependences: function() {
			var _self = this,
				depends = _self.get('depends');

			ServYou.each(depends, function(action,name) {
				_self.addDependence(name, action);
			});
		},

		addDependence: function(name, action) {
			var _self = this,
				dependencesMap = _self.get('dependencesMap'),
				depend;

			_self.removeDependence(name);
			depend = bindDepend(_self, name, action);
			if (depend) {
				dependencesMap[name] = depend;
			}
		},

		removeDependence: function(name) {
			var _self = this,
				dependencesMap = _self.get('dependencesMap'),
				depend = dependencesMap[name];

			if (depend) {
				offDepend(depend);
				delete dependencesMap[name];
			}
		},

		clearDependences: function() {
			var _self = this,
				map = _self.get('dependencesMap');

			ServYou.each(map, function(depend, name) {
				offDepend(depend);
			});

			_self.set("dependencesMap", {});
 		},

		__destructor: function() {
			this.clearDependences();
		}
	}
})()