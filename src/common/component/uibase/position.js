(function() {

	function PositionView() {

	}

	PositionView.ATTRS = {
		x: {
			valueFn: function() {
				var self = this;
				return self.get('el') && self.get('el').offset().left;
			}
		},

		y: {

			valueFn: function() {
				var self = this;
				return self.get('el') && self.get('el').offset().top;
			}
		},

		zIndex: {

		},

		visibleMode: {
			value:'visibility'
		}
	}

	PositionView.prototype = {
		__createDom: function() {
			this.get('el').addClass(ServYou + 'ext-position');
		},

		_uiSetZIndex: function(x) {
			this.get('el').css('z-index', x);
		},

		_uiSetX: function(x) {
			if (x != null) {
				this.get('el').offset({
					left: x
				});
			}
		},
		_uiSetY: function(y) {
			if (y != null) {
				this.get('el').offset({
					top:y
				})
			}
		},

		_uiSetLeft: function(left) {
			if (left != null) {
				this.get('el').css({left:left});
			}
		},

		_uiSetTop: function(top) {
			if (top != null) {
				this.get('el').css({top: top});
			}
		}
	};

	function Position() {

	}

	Position.ATTRS = 
	{

		x: {
			view: 1
		},

		y: {
			view: 1
		},

		left: {
			view: 1
		},

		top: {
			view: 1
		},

		xy: {
			setter: function(v) {
				var self = this,
					xy = $.makeArray(v);

				if (xy.length) {
					xy[0] && self.set('x', xy[0]);
					xy[1] && self.set('y', xy[1]);
				}

				return v;
			},

			getter: function() {
				return [this.get('x'), this.get('y')];
			}
		},

		zIndex: {
			view: 1
		},

		visible: {
			view: true,
			value: true
		}
	};


	Position.prototype = 
	{

		move: function(x, y) {
			var self = this;
			if (ServYou.isArray(x)) {
				y = x[1];
				x = x[0];
			}
			self.set('xy', [x, y]);
		},

		_uiSetX: function(v) {
			if (v != null) {
				var _self = this,
					el = _self.get('el');

				_self.setInternal('left', el.position().left);
				if (v != -999) {
					this.set('cachePosition', null);
				}
			}
		},

		_uiSetY: function(v) {
			if (v != null) {
				var _self = this,
					el = _self.get('el');
				_self.setInternal('top', el.position().top);
				if (v != -999) {
					this.set('cachePosition', null);
				}
			}
		},

		_uiSetLeft: function(v) {
			var _self = this,
				el = _self.get('el');

			if (v != null) {
				_self.setInternal('x', el.offset().left);
			}
		},

		_uiSetTop: function(v) {
			var _self = this,
				el = self.get('el');

			if (v != null) {
				_self.setInternal('y', el.offset().top);
			}
		}

	};

	Position.View = PositionView;
	return Position;

})()