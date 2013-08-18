(function() {

	var UIBase = ServYou.UIBase,
		Manager = ServYou.Manager,
		View = ServYou.View,
		wrapBehavior = ServYou.wrapBehavior,
		getWrapBehavior = ServYou.getWrapBehavior;

	function wrapperViewSetter(attrName) {
		return function(ev) {
			var self = this;

			if (self === ev.target) {
				var value = ev.newVal,
					view = self.get('view');

				if (view) {
					view.set(attrName, value);
				}
			};
		}
	}

	function wrapperViewGetter(attrName) {
		return function(v) {
			var self = this,
				view = self.get('view');

			return v === undefined ? view.get(attrName) : v;
		};
	}

	function initChild(self, c, renderBefore) {

		self.create();
		var contentEl = self.getContentElement(),
			defaultCls = self.get('defaultChildClass');

		if (!c.xclass && !(c instanceof Controller)) {
			if (!c.xtype) {
				c.xclass = defaultCls;
			} else {
				c.xclass = defaultCls + '-' + c.xtype;
			}
		}

		c = ServYou.Component.create(c, self);
		c.setInternal('parent', self);

		c.set('render', contentEl);
		c.set('elBefore', renderBefore);

		c.create(undefined);
		return c;

	}

	function constructView(self) {
		
		var attrs,
			attrCfg,
			attrName,
			cfg = {},
			v,
			Render = self.get('xview');

		attrs = self.getAttrs();

		for (attrName in attrs) {
			if (attrs.hasOwnProperty(attrName)) {
				attrCfg = attrs[attrName];
				if (attrCfg.view) {

					if ((v = self.get(attrName)) !== undefined) {
						cfg[attrName] = v;
					}

					self.on('after' + ServYou.ucfirst(attrName) + 'Change', wrapperViewSetter(attrName));

					attrCfg.getter = wrapperViewGetter(attrName);
				}
			}
		}

		delete cfg.autoRender;
		cfg.ksComponentCss = getComponentCss(self);
		return new Render(cfg);
	}

	function getComponentCss(self) {
		var constructor = self.constructor,
			cls,
			re = [];

		while (constructor && constructor !== Controller) {
			cls = Manager.getXClassByConstructor(constructor);
			if (cls) {
				re.push(cls);
			}
			constructor = constructor.superclass && constructor.superclass.constructor;
		}

		return re.join(' ');
	}

	function isMouseEventWithinElement(e, elem) {
		var relatedTarget = e.relatedTarget;

		return relatedTarget &&
			(relatedTarget === elem[0] || $.contains(elem, relatedTarget));
	}

	var Controller = UIBase.extend([UIBase.Decorate, UIBase.Tpl, UIBase.ChildCfg, UIBase.KeyNav, UIBase.Depends],
	{

		isController: true,

		getCssClassWithPrefix: Manager.getCssClassWithPrefix,

		initializer: function() {
			var self = this;

			if (!self.get('id')) {
				self.set('id', self.getNextUniqueId());
			}

			Manager.addComponent(self.get('id'), self);

			self.setInternal('view', constructView(self));
		},

		getNextUniqueId: function() {
			var self = this,
				xclass = Manager.getXClassByConstructor(self.constructor);
			return ServYou.guid(xclass);
		},

		createDom: function() {
			var self = this,
				view = self.get('view');

			view.create(undefined);
		},

		renderUI: function() {
			var self = this,
				loader = self.get('loader');

			self.get('view').render();
			self._initChildren();
			if (loader) {
				self.setInternal('loader', loader);
			}
		},

		_initChildren: function(children) {
			var self = this,
				i,
				children,
				child;

			children = children || self.get('children').concat();
			self.get('children').length = 0;
			for (i = 0; i < children.length; i++) {
				child = self.addChild(children[i]);
				child.render();
			}
		},

		bindUI: function() {
			var self = this,
				events = self.get('events');

			this.on('afterVisibleChange', function(e) {
				this.fire(e.newVal ? 'show' : 'hide');
			})

			ServYou.each(events, function(v, k) {
				self.publish(k, {
					bubbles:v
				})
			});
		},

		containsElement: function(elem) {
			var self = this,
				el = self.get('el'),
				children = self.get('children'),
				result = false;

			if (!self.get('rendered')) {
				return false;
			}

			if ($.contains(el[0], elem) || el[0] === elem) {
				result = true
			} else {
				ServYou.each(children, function(item) {
					if (item.containsElement(elem)) {
						result = true;
						return false;
					}
				})
			}
			return result;
		},

		isChildrenElement: function(elem) {
			var self = this,
				children = self.get('children'),
				rst = false;

			ServYou.each(children, function(child) {
				if (child.containsElement(elem)) {
					rst = true;
					return false;
				}
			});

			return rst;
		},

		show: function() {
			var self = this;
			self.render();
			self.set('visible', true);
			return self;
		},

		hide: function() {
			var self = this;
			self.set('visible', false);
			return self;
		},

		toggle: function() {
			this.set('visible', !this.get('visible'));
			return this;
		},

		_uiSetFocusable: function(focusable) {
			var self = this,
				t,
				el = self.getKeyEventTarget();

			if (focusable) {
				el.attr('tabIndex', 0)
					.attr('hideFocus', true)
					.on('focus', wrapBehavior(self, 'handleFocus'))
					.on('blur', wrapBehavior(self, 'handleBlur'))
					.on('keydown', wrapBehavior(self, 'handleKeydown'))
					.on('keyup', wrapBehavior(self, 'handleKeyUp'));
			} else {
				el.removeAttr('tabIndex');
				if (t = getWrapBehavior(self, 'handleFocus')) {
					el.off('focus', t);
				}
				if (t = getWrapBehavior(self, 'handleBlur')) {
					el.off('blur', t);
				}
				if (t = getWrapBehavior(self, 'handleKeydown')) {
					el.off('keydown', t)
				}
				if (t = getWrapBehavior(self, 'handleKeyUp')) {
					el.off('keyup', t);
				}
			}
		},

		_uiSetHandleMouseEvents: function(handleMouseEvents) {
			var self = this, el = self.get('el'), t;

			if (handleMouseEvents) {
				el.on('mouseenter', wrapBehavior(self, 'handleMouseEnter'))
					.on('mouseleave', wrapBehavior(self, 'handleMouseLeave'))
					.on('contextmenu', wrapBehavior(self, 'handleConextMenu'))
					.on('mousedown', wrapBehavior(self, 'handleMouseDown'))
					.on('mouseup', wrapBehavior(self, 'handleMouseUp'))
					.on('dblclick', wrapBehavior(self, 'handleDblClick'));
			} else {
				if (t = getWrapBehavior(self, 'handleMouseEnter')) {
					el.off('mouseenter', t);
				}
				if (t = getWrapBehavior(self, 'handleMouseLeave')) {
					el.off('mouseleave', t);
				}
				if (t = getWrapBehavior(self, 'handleConextMenu')) {
					el.off('contextmenu', t);
				}
				if (t = getWrapBehavior(self, 'handleMouseDown')) {
					el.off('mousedown', t);
				}
				if (t = getWrapBehavior(self, 'handleMouseUp')) {
					el.off('mouseup', t);
				}
				if (t = getWrapBehavior(self, 'handleDblClick')) {
					el.off('dblclick', t);
				}

			}
		},

		_uiSetFocused: function(v) {
			if (v) {
				this.getKeyEventTarget()[0].focus();
			}
		},

		_uiSetVisible: function(isVisible) {
			var self = this,
				el = self.get('el'),
				visibleMode = self.get('visibleMode');

			if (visibleMode === 'visibility') {
				if (isVisible) {
					var position = self.get('cachePosition');
					if (position) {
						self.set('xy', position);
					}
				}
				if (!visibility) {
					var position = [
						self.get('x'), self.get('y')
					];
					self.get('cachePosition', position);
					self.set('xy', [-999, -999]);
				}
			}
		},

		_uiSetChildren: function(v) {
			var self = this,
				children = ServYou.cloneObject(v);

			self._initChildren(children);
		},

		enable: function() {
			this.set('disabled', false);
			return this;
		},

		disable: function() {
			this.set('disabled', true);
			return this;
		},

		getContentElement: function() {
			return this.get('view').getContentElement();
		},

		getKeyEventTarget: function() {
			return this.get('view').getKeyEventTarget();
		},

		addChild: function(c, index) {
			var self = this,
				children = self.get('children'),
				renderBefore;

			if (index === undefined) {
				index = children.length;
			}

			self.fire('beforeAddChild', {child: c, index : index});
			renderBefore = children[index] && children[index].get('el') || null;
			c = initChild(self, c, renderBefore);
			children.splice(index, 0, c);

			if (self.get('rendered')) {
				c.render();
			}

			self.fire('afterAddChild', {child: c, index: index});
			return c;
		},

		remove: function(destroy) {
			var self = this,
				parent = self.get('parent');

			if (parent) {
				parent.removeChild(self, destroy);
			} else if (destroy) {
				self.destroy();
			}

			return self;
		},

		removeChild: function(c, destroy) {
			var self = this,
				children = self.get('children'),
				index = ServYou.Array.indexOf(c, children);

			if (index === -1) {
				return;
			}

			self.fire('beforeRemoveChild', {child:c, destroy:destroy});

			if (index !== -1) {
				children.splice(index, 1);
			}

			if (destroy && c.destroy) {
				c.destroy();
			}

			self.fire('afterRemoveChild', {child:c, destroy:destroy});
			return c;
		},

		removeChildren: function(destroy) {
			var self = this,
			i,
			t = [].concat(self.get('children'));

		for (i = 0; i < t.length; i++) {
			self.removeChild(t[i], destroy);
		}
		},

		getChildAt: function(index) {
			var children = this.get('children');
			return children[index] || null;
		},

		getChild: function(id, deep) {
			return this.getChildBy(function(item) {
				return item.get('id') === id;
			}, deep);
		},

		getChildBy: function(math, deep) {
			return this.getChildrenBy(math, deep)[0] || null;
		},

		getAppendHeight: function() {
			var el = this.get('el');
			return el.outerHeight() - el.height();
		},

		getAppendWidth: function() {
			var el = this.get('el');
			return el.outerWidth() - el.width();
		},

		getChildrenBy: function(math, deep) {
			var self = this,
				results = [];

			if (!math) {
				return results;
			}

			self.eachChild(function(child) {
				if (math(child)) {
					results.push(child);
				} else if (deep) {
					results = results.concat(child.getChildrenBy(math, deep));
				}
			});

			return results;
		},

		eachChild: function(func) {
			ServYou.each(this.get('children'), func);
		},

		handleDblClick: function() {

		},

		handleMouseOver: function() {

		},

		handleMouseOut: function() {

		},

		handleMouseEnter: function() {

		},

		handleMouseLeave: function() {

		},

		handleMouseDown: function() {

		},

		handleMouseUp: function() {

		},

		handleConextMenu: function() {

		},

		handleFocus: function() {

		},

		handleBlur: function() {

		},

		handleKeyEventInternal: function() {

		},

		handleKeydown: function() {

		},

		handleKeyUp: function() {

		},

		performActionInternal: function() {

		},

		destructor: function() {

		}
	},
	{
		ATTRS:
		{
			content: {
				view: 1
			},

			elTagName: {
				view: true,
				value:'div'
			},

			defaultChildClass: {

			},

			xtype : {

			},

			id: {
				view: true
			},

			width:{
				view: 1
			},

			height: {
				view: 1
			},

			elCls: {
				view:1
			},

			elStyle:{
				view:1
			},

			elAttrs:{
				view:1
			},

			elBefore: {
				view:1
			},

			el: {
				view:1
			},

			events: {
				value: {
					'click' : true,

					'dblclick': true,

					'mouseenter': true,

					'mouseleave': true,

					'keydown': true,

					'keyup': true,

					'focus':false,

					'blur':false,

					'mousedown':true,

					'mouseup': true,

					'show': false,

					'hide': false
				}
			},

			render: {
				view:1
			},

			statusCls: {
				view: true,
				value:{

				}
			},

			visibleMode: {
				view: 1
				value:'display'
			},

			visible: {
				value: true,
				view: 1
			},

			handleMouseEvents: {
				value: true
			},

			focusable: {
				value: false,
				view: 1
			},

			defaultLoaderCfg: {
				value: {
					property: 'content',
					autoLoad: true
				}
			},

			loader: {
				getter: function(v) {

				}
			},

			allowTextSelection: {
				value: true
			},

			activeable: {
				value: true
			},

			focused: {
				view: 1
			},

			active: {
				view: 1
			},

			highlighted: {
				view:1
			},

			children: {
				sync: false,
				value:[]
			},

			prefixCls: {
				value:ServYou.prefix,
				view: 1
			},

			parent: {
				setter: function(p) {

				}
			},

			disabled: {
				view: 1,
				value: false
			},

			xview: {
				value: View
			}
		},
		PARSER: {
			visible: function(el) {

			}
		}
	}, {
		xclass: 'controller',
		priority: 0
	})

	ServYou.Controller = Controller;
})()