(function() {
	var uis = {

	}

	function getConstructorByXClass(cls) {
		var cs = cls.split(/\s+/),
			p = -1,
			t,
			ui = null;

		for (var i = 0; i < cs.length; i++) {
			var uic = uis[cs[i]];
			if (uic && (t = uic.priority) > p) {
				p = t;
				ui = uic.constructor;
			}
		}

		return ui;
	}

	function getXClassByConstructor(constructor) {
		for (var u in uis) {
			var ui = uis[u];
			if (ui.constructor == constructor) {
				return u;
			}
		}

		return 0;
	}

	function setConstructorByXClass(cls, uic) {
		if (ServYou.isFunction(uic)) {
			uis[cls] = {
				constructor:uic,
				priority:0
			}
		} else {
			uic.priority = uic.priority;
			uis[cls] = uic;
		}
	}

	function getCssClassWithPrefix(cls) {
		var cs = $.trim(cls).split(/\s+/);

		for (var i = 0; i < cs.length; i++) {
			if (cs[i]) {
				cs[i] = this.get('prefixCls') + cs[i];
			}
		}

		return cs.join(' ');
	}

	var componentInstances = {};

	var Manager = {

		__instances:componentInstances,

		addComponent: function(id, component) {

		},

		removeComponent: function(id) {

		},

		getComponent: function(id) {

		},

		getCssClassWithPrefix: getCssClassWithPrefix,

		getXClassByConstructor:getXClassByConstructor,

		getConstructorByXClass:getConstructorByXClass,

		setConstructorByXClass: setConstructorByXClass
	};

	ServYou.Manager = Manager;
	
})()