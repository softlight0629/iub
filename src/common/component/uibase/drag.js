(function() {

	var dragBackId = ServYou.guid('drag');

	var drag = function() {

	} 

	drag.ATTRS = 
	{
		dragNode : {

		},

		draging: {
			setter: function(v) {
				if (v === true) {
					return {};
				}
			},
			value: null
		},

		constraint: {

		},

		dragBackEl: {

			getter: function() {
				return $('#' + dragBackId);
			}
		}
	};

	var dragTpl = '<div id="' + dragBackId + '" style="background-color: red; position: fixed; left: 0px;
		width: 100%; height: 100%; top:0px; cursor:move; z-index:999999; display:none; "></div>';

	function initBack() {
		var el = $(dragTpl).css('opacity', 0).prependTo('body');
		return el;
	}

	drag.prototype = {

		__bindUI: function() {
			var _self = this,
				constraint = _self.get('constraint'),
				dragNode = _self.get('dragNode');

			if (!dragNode) {
				return;
			}

			dragNode.on('mousedown', function(e) {

				if (e.which == 1) {
					e.preventDefault();
					_self.set('draging', {
						elX: _self.get('x'),
						elY: _self.get('y'),
						startX: e.pageX,
						startY: e.pageY
					});

					registEvent();
				}
			});

			function mouseMove(e) {
				var draging = _self.get('draging');
				if (draging) {
					e.preventDefault();
					_self._dragMoveTo(e.pageX, e.pageY, draging, constraint);
				}
			}

			function mouseUp(e) {
				if (e.which == 1) {
					_self.set('draging',false);
					var dragBackEl = _self.get('dragBackEl');
					if (dragBackEl) {
						dragBackEl.hide();
					}
					unregistEvent();
				}
			}

			function registEvent() {
				$(document).on('mousemove', mouseMove);
				$(document).on('mouseup', mouseUp);
			}

			function unregistEvent() {
				$(document).off('mousemove', mouseMove);
				$(document).off('mouseup', mouseUp);
			}
		},

		_dragMoveTo: function(x, y, draging, constraint) {
			var _self = this,
				dragBackEl = _self.get('dragBackEl'),
				draging = draging || _self.get('draging'),
				offsetX = draging.startX - x,
				offsetY = draging.startY - y;

			if (!dragBackEl.length) {
				dragBackEl = initBack();
			}
			dragBackEl.css({
				cursor: 'move',
				display:'block'
			});
			_self.set('xy', [_self._getConstrainX(draging.elX - offsetX, constraint)],
							 _self._getConstrainY(draging.elY - offsetY, constraint)]);
		},

		_getConstrainX: function(x, constraint) {
			var _self = this,
				width = _self.get('el').outerWidth(),
				endX = x + width,
				curX = _self.get('x');

			if (constraint) {
				var constraintOffset = constraint.offset();
				if (constraintOffset.left >= x) {
					return constraintOffset.left;
				}

				if (constraintOffset.left + constraint.width() < endX) {
					return constraintOffset + constraint.width() - width;
				}
				return x;
			}

			if (ServYou.isInHorizontalView(x) && ServYou.isInHorizontalView(endX)) {
				return x;
			}

			return curX;
		},

		_getConstrainY: function(y ,constraint) {
			var _self = this,
				height = _self.get('el').outerHeight(),
				endY = y + height,
				curY = _self.get('y');

			if (constraint) {
				var constraintOffset = constraint.offset();
				if (constraintOffset.top > y) {
					return constraintOffset.top;
				}
				if (constraintOffset.top + constraint.height() < endY) {
					return constraintOffset.top + constraint.height() - height;
				}

				return y;
			}

			if (ServYou.isInVerticalView(y) && ServYou.isInVerticalView(endY)) {
				return y;
			}

			return curY;
		}
	}

	ServYou.Drag = drag;
})()