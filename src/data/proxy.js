(function() {

	var proxy = function(config) {
		proxy.superclass.constructor.call(this, config);
	};

	proxy.ATTRS = {

	};

	ServYou.extend(proxy, ServYou.Base);

	ServYou.augment(proxy,{
		_read: function(params, callback) {

		},

		read: function(params, callback, scope) {
			var _self = this;
			scope = scope || _self;

			_self._read(params, function(data) {
				callback.call(scope, data);
			});
		},

		update: function(params, callback, scope) {

		}
	});

	var memertProxy = function(config) {
		memertProxy.superclass.constructor.call(this, config);
	}

	ServYou.extend(memertProxy, proxy);

	ServYou.augment(memertProxy, {

		_read: function(params, callback) {
			var _self = this,
				data = _self.get('data');
		}
	});


	var SuiProxy = function(config) {
		SuiProxy.superclass.constructor.call(this, config);
	}

	SuiProxy.ATTRS = {
		xmodelMap: {
			value: {
				'desk-app', '_readDeskApp',
				'domain-app', '_readDomainApp',
				'desk': '_readDesk'
			}
		}
	}

	ServYou.extend(SuiProxy, proxy);



	ServYou.augment(SuiProxy, {

		_read: function(params, callback) {
			var xmodel = params.xmodel,
				id = params.id,
				xmodelMap = this.get('xmodelMap');

			_self[xmodelMap](params, callback);
		},

		_readDeskApp: function(params, callback) {

		}
	})
})()