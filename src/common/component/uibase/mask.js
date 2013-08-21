(function() {

	var UA = ServYou.UA,
		maskMap = {},
		ie6 = UA.ie == 6;


	function getMaskCls(self) {
		return self.get('prefixCls') + 'ext-mask';
	}

	function docWidth() {
		return ie6 ? ServYou.docWidth() + 'px' : '100%';
	}

	function docHeight() {
		return ie6 ? ServYou.docHeight() + 'px' : '100%';
	}

	function initMask(maskCls) {
		var mask = $('<div' +
			' style="width:' + docWidth() + ';' + 
			'left:0;' + 
			'top:0;' + 
			'height:' + docHeight() + ';' + 
			'position:' + (ie6 ? 'absolute' : 'fixed') + ';"' + 
			' class=' + 
			maskCls + 
			'">' + 
			(ie6 ? '<' + 'iframe ' + 
				'style="position:absolute;' + 
				'left:' + '0' + ';' + 
				'top:' + '0' + ';' +
				'background:white;' + 
				'width:expression(this.parentNode.offsetWidth);' + 
				'height:expression(this.parentNode.offsetHeight);' + 
				'filter:alpha(opacity=0);' + 
				'z-index:-1;"></iframe' : '') + 
			'</div>').prependTo('body');

		mask.on('mousedown', function(e) {
			e.preventDefault();
		});

		return mask;
	}

	function MaskView() {

	}

	MaskView.ATTRS = {
		maskShared: {
			value: true
		}
	}

	MaskView.prototype = {

		_maskExtShow: function() {
			var self = this,
				zIndex,
				maskCls = getMaskCls(self),
				maskDesc = maskMap[maskCls],
				maskShared = self.get('maskShared'),
				mask = self.get('maskNode');

			if (!mask) {
				if (maskShared) {
					if (maskDesc) {
						mask = maskDesc.node;
					} else {
						mask = initMask(maskCls);
						maskDesc = maskMap[maskCls] = {
							num : 0,
							node: mask
						};
					}
				} else {
					mask = initMask(maskCls);
				}
			}

			if (zIndex = self.get('zIndex')) {
				mask.css('z-index', zIndex - 1);
			}

			if (maskShared) {
				maskDesc.num++;
			}

			if (!maskShared || maskDesc.num == 1) {
				mask.show();
			}
		},

		_maskExtHide: function() {
			var self = this,
				maskCls = getMaskCls(self),
				maskDesc = maskMap[maskCls],
				maskShared = self.get('maskShared'),
				mask = self.get('maskNode');

			if (maskShared && maskDesc) {
				maskDesc.num = Math.max(maskDesc.num - 1, 0);
				if (maskDesc.num == 0) {
					mask.hide();
				}
			} else if (mask) {
				mask.hide();
			}
		},

		__destructor: function() {
			var self = this,
				maskShared = _self.get('maskShared'),
				mask = self.get('maskNode');

			if (self.get('maskNode')) {
				if (maskShared) {
					if (self.get('visible')) {
						self._maskExtHide();
					}
				} else {
					mask.remove();
				}
			}
		}
	}


	function Mask() {

	}

	Mask.ATTRS = {

		mask: {
			value: false
		},

		maskNode: {
			view: 1
		},

		maskShared: {
			view: 1
		}
	}

	Mask.prototype = {

		__bindUI: function() {
			var self = this,
				view = self.get('view'),
				_maskExtShow = view._maskExtShow,
				_maskExtHide = view._maskExtHide;

			if (self.get('mask')) {
				self.on('show', _maskExtShow, view);
				self.on('hide', _maskExtHide, view);
			}
		}
	}

	Mask.View = MaskView;

	ServYou.Mask = Mask;

})()