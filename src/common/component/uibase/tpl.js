(function() {

	function tplView() {

	}

	tplView.ATTRS = {

		tpl:{

		}
	}

	ServYou.augment(tplView,
	{
		__renderUI: function() {
			var _self = this,
				contentContainer = _self.get('childContainer'),
				contentEl;

			if (contentContainer) {
				contentEl = _self.get('el').find(contentContainer);
				if (contentEl.length) {
					_self.set('contentEl', contentEl);
				}
			}
		},

		getTpl: function(attrs) {
			var _self = this,
				tpl = _self.get('tpl'),
				tplRender = _self.get('tplRender');

			attrs = attrs || _self.getAttrVals();

			if (tplRender) {
				return tplRender(attrs);
			}
			if (tpl) {
				return ServYou.substitute(tpl, attrs);
			}

			return '';
		},

		setTplContent: function(attrs) {
			var _self = this,
				el = _self.get('el'),
				content = _self.get('content'),
				tpl = _self.getTpl(attrs);

			if (!content && tpl) {
				el.empty();
				el.html(tpl);
			}
		}
	})

	function tpl() {

	}

	tpl.ATTRS = {

		tpl: {
			view: true,
			sync: false
		},

		tplRender: {
			view: true,
			value: null
		},

		childContainer: {
			view: true
		}
	};

	ServYou.augment(tpl,
	{
		__renderUI: function() {
			if (!this.get('srcNode')) {
				this.setTplContent();
			}
		},

		setTplContent: function() {
			var _self = this,
				attrs = _self.getAttrVals();

			_self.get('view').setTplContent(attrs);
		},

		_uiSetTpl: function() {
			this.setTplContent();
		}
	})

	tpl.View = tplView;

	ServYou.tpl = tpl;

})()