(function() {

	var Manager = ServYou.Manager,
		UI_SET = '_uiSet',
		ATTRS = 'ATTRS',
		ucfirst = ServYou.ucfirst,
		noop = $.noop,
		Base = ServYou.Base;

	function initHierarchy(host, config) {
		callMethodByHierarchy(host, 'initializer', 'constructor');
	}

	function callMethodByHierarchy(host, mainMethod, extMethod) {
		var c = host.constructor,
			extChains = [],
			ext,
			main,
			exts,
			t;

		while(c) {

			t = [];
			if (exts = c.mixins) {
				for (var i = 0; i < exts.length; i++) {
					ext = exts[i];
					if (ext) {
						if (extMethod != 'constructor') {
							if (ext.prototype.hasOwnProperty(extMethod)) {
								ext = ext.prototype[extMethod];
							} else {
								ext = null;
							}
						}

						ext && t.push(ext);
					}
				}
			}

			if (c.prototype.hasOwnProperty(mainMethod) && (main = c.prototype[mainMethod])) {
				t.push(main);
			}

			if (t.length) {
				extChains.push.apply(extChains, t.reverse());
			}

			c = c.superclass && c.superclass.constructor;
		}

		for (i = extChains.length - 1; i >= 0; i--) {
			extChains[i] && extChains[i].call(host);
		}
	}

	function destroyHierarchy(host) {
		var c = host.constructor,
			extensions,
			d,
			i;

		while (c) {
			if (c.prototype.hasOwnProperty('destructor')) {
				c.prototype.destructor.apply(host);
			}

			if ((extensions = c.mixins)) {
				for (i = extensions.length - 1; i >= 0; i--) {
					d = extensions[i] && extensions[i].prototype.__destructor;
					d && d.apply(host);
				}
			}

			c = c.superclass && c.superclass.constructor;
		}
	}

	function constructPlugins(plugins) {
		if (!plugins) {
			return;
		}

		ServYou.each(plugins, function(plugin, i) {
			if (ServYou.isFunction(plugin)) {
				plugins[i] = new plugin();
			}
		})
	}

	function actionPlugins(self, plugins, action) {
		if (!plugins) {
			return;
		}

		ServYou.each(plugins, function(plugin, i) {
			if (plugin[action]) {
				plugin[action](self);
			}
		})
	}

	function bindUI(self) {
		var attrs = self.getAttrs(),
			attr,
			m;

		for (attr in attrs) {
			if (attrs.hasOwnProperty(attr)) {
				m = UI_SET + ucfirst(attr);
				if (self[m]) {
					(function (attr, m) {
						self.on('after' + ucfirst + 'Change', function (ev) {

							if (ev.target === self) {
								self[m](ev.newVal, ev);
							}
						})
					})(attr, m)
				}
			}
		}
	}

	function syncUI(self) {
		var v,
			f,
			attrs = self.getAttrs();

		for (var a in attrs) {
			if (attrs.hasOwnProperty(a)) {
				var m = UI_SET + ucfirst(a);

				if ((f = self[m]) && attrs[a].sync !== false && (v = self.get(a)) !== undefined) {
					f.call(self, v);
				}
			}
		}
	}

	var UIBase = function(config) {
		var _self = this,
			id;

		Base.apply(_self, arguments);

		_self.setInternal('userConfig', config);

		initHierarchy(_self, config);

		var listener,
			n,
			plugins = _self.get('plugins'),
			listeners = _self.get('listeners');

		constructPlugins(plugins);

		var xclass = _self.get('xclass');

		if (xclass) {
			_self.__xclass = xclass;
		}

		actionPlugins(_self, plugins, 'initializer');

		config && config.autoRender && _self.render();

	}

	UIBase.ATTRS = {

		userConfig : {

		},

		autoRender: {
			value : false
		},

		listeners: {
			value : {}
		},

		plugins: {
			value: []
		},

		rendered: {
			value:false
		},

		xclass: {
			valueFn: function() {
				return Manager.getXClassByConstructor(this.constructor);
			}
		}
	}

	ServYou.extend(UIBase, Base);

	ServYou.augment(UIBase, 
	{

		create: function() {
			var self = this;

			if (!self.get('created')) {
				self.fire('beforeCreateDom');
				callMethodByHierarchy(self, 'createDom', '__createDom');
				self._set('created', true);

				self.fire('afterCreateDom');
				actionPlugins(self, self.get('plugins'), 'createDom');
			}

			return self;
		},

		render: function() {
			var _self = this;

			if (!_self.get('rendered')) {
				var plugins = _self.get('plugins');
				_self.create(undefined);

				_self.fire('beforeRenderUI');
				callMethodByHierarchy(_self, 'renderUI', '__renderUI');

				_self.fire('afterRenderUI');
				actionPlugins(_self, plugins, 'renderUI');

				_self.fire('beforeBindUI');
				bindUI(_self);
				callMethodByHierarchy(_self, 'bindUI', '__bindUI');

				_self.fire('afterBindUI');
				actionPlugins(_self, plugins, 'bindUI');

				_self.fire('beforeSyncUI');

				syncUI(_self);
				callMethodByHierarchy(_self, 'syncUI', '__syncUI');

				_self.fire('afterSyncUI');
				actionPlugins(_self, plugins, 'syncUI');
				_self._set('rendered', true);
			}

			retrn _self;
		},

		createDom: noop,

		renderUI: noop,

		bindUI: noop,

		syncUI: noop,

		destroy: function() {
			var _self = this;

			actionPlugins(_self, _self.get('plugins'), 'destructor');
			destroyHierarchy(_self);
			_self.fire('destroy');
			_self.off();
			_self.clearAttrVals();
			_self.destroyed = true;
			
			return _self;
		}

	})
})()