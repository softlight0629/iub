(function() {

	var win = window,
		Manager = ServYou.Manager,
		UIBase = ServYou.UIBase,
		doc = document;

	var View = UIBase.extend([UIBase.TplView],
	{

		getComponentCssClassWithState: function(state) {
			var self = this,
				componentCls = self.get('ksComponentCss');

			state = state || '';
			return self.getCssClassWithPrefix(componentCls.split(/\s+/).join(state + ' ' + state))
		},

		getCssClassWithPrefix: Manager.getCssClassWithPrefix,

		getKeyEventTarget: function() {
			return this.get('el');
		},

		getContentElement: function() {
			return this.get('contentEl') || this.get('el');
		},

		getStatusCls: function(name) {
			var self = this,
				statusCls = self.get('statusCls'),
				cls = statusCls[name];

			if (!cls) {
				cls = self.getComponentCssClassWithState('-' + name);
			}

			return cls;
		},

		renderUI: function() {
			var self = this;

			if (!self.get('srcNode')) {
				var render = self.get('render'),
					el = self.get('el'),
					renderBefore = self.get('elBefore');

				if (renderBefore) {
					el.insertBefore(renderBefore, undefined);
				} else if (render) {
					el.appendTo(render, undefined);
				} else {
					el.appendTo(doc.body, undefined);
				}
			}
		},

		createDom: function() {
			var self = this,
				contentEl = self.get('contentEl'),
				el = self.get('el');

			if (!self.get('srcNode')) {
				el = $('<' + self.get('elTagName') + '>');

				if (contentEl) {
					el.append(contentEl);
				}

				self.setInternal('el', el);
			}

			el.addClass(self.getComponentCssClassWithState());
			if (!contentEl) {
				self.setInternal('contentEl', el);
			}
		},

		_uiSetHighlighted: function(v) {
			var self = this,
				componentCls = self.getStatusCls('hover'),
				el = self.get('el');
			el[v ? 'addClass' : 'removeClass'](componentCls);
		},

		_uiSetDisabled: function(v) {
			var self = this,
				componentCls = self.getStatusCls('disabled'),
				el = self.get('el');

			el[v ? 'addClass' : 'removeClass'](componentCls)
				.attr('aria-disabled', v);

			if (v && self.get('highlighted')) {
				self.set('highlighted', false);
			}

			if (self.get('focusable')) {
				self.getKeyEventTarget().attr('tabIndex', v ? -1 : 0);
			}
		},

		_uiSetActive: function(v) {
			var self = this,
				componentCls = self.getStatusCls('active');

			self.get('el')[v ? 'addClass' : 'removeClass'](componentCls)
				.attr('aria-pressed', !!v);
		},

		_uiSetFocused: function(v) {
			var self = this,
				el = self.get('el'),
				componentCls = self.getStatusCls('focused');

			el[v ? 'addClass' : 'removeClass'](componentCls);
		},

		_uiSetELAttrs: function(v) {
			this.get('el').attr(attrs);
		},

		_uiSetElCls: function(cls) {
			this.get('el').addClass(cls);
		}

		_uiSetELStyle: function(style) {
			this.get('el').css(style);
		},

		_uiSetWidth: function(w) {
			this.get('el').width(w);
		},

		_uiSetHight: function(h) {
			this.get('el').height(h);
		},

		_uiSetContent: function(c) {
			var self = this,
				el;

			if (self.get('srcNode') && !self.get('rendered')) {

			} else {
				el = self.get('contentEl');
				if (typeof c == 'string') {
					el.html(c);
				} else if (c) {
					el.empty().append(c);
				}
			}
		},

		_uiSetVisible: function(isVisible) {
			var self = this,
				el = self.get('el'),
				visibleMode = self.get('visibleMode');

			if (visibleMode === 'visibility') {
				el.css('visibility', isVisible ? 'visible' : 'hidden');
			} else {
				el.css('display', isVisible ? '' : 'none');
			}
		},

		destructor: function() {
			var el = this.get('el');
			if (el) {
				el.remove();
			}
		}
	}, {
		xclass: 'view',
		priotity: 0
	});

	View.ATTRS = 
	{
		el: {
			setter: function(v) {
				return $(v);
			}
		},

		elCls: {

		},

		elStyle: {

		},

		width: {

		},

		height: {

		},

		statusCls: {
			value: {}
		},

		elTagName: {
			value:'div'
		},

		elAttrs: {

		},

		content: {

		},

		elBefore: {

		},

		render:{

		},

		visibleMode: {
			value:'display'
		},

		cachePosition: {

		},

		contentEl: {
			valueFn: function() {
				return this.get('el');
			}
		},

		prefixCls: {
			value:ServYou.prefix
		},

		focusable: {
			value:true
		},

		focused: {},

		active: {},

		disabled: {},

		highlighted: {}
	};

	ServYou.View = View;
})()