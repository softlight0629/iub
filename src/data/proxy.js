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
            var _self = this,
                scope = scope || _self;

            _self._read(params, function(data) {
                callback.call(scope, data);
            });
        },

        update: function(params, callback, scope) {
            var _self = this,
                scope = scope || _self;

            _self._update(params, function(data) {
                callback.call(scope, data)
            });
        },

        _update: function(params, callback) {

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
        xmodelReadMap: {
            value: {
                'desk-app': '_readDeskApp',
                'domain-app': '_readDomainApp',
                'desk': '_readDesk'
            }
        },

        xmodelUpdateMap: {
            value: {
                'desk-app': '_updateDeskApp'
            }
        },

        data: {
            value:cacheData
        },

        desks: {
            value: cacheData['desks']
        },

        domains: {
            value: cacheData['domain']
        },

        systemConfig: {
            value: cacheData['systemConfig']
        },

        theme: {
            value: cacheData['theme']
        },

        userConfig: {
            value: cacheData['userConfig']
        }
    }

    ServYou.extend(SuiProxy, proxy);



    ServYou.augment(SuiProxy, {

        _read: function(params, callback) {
            var _self = this,
                xmodel = params.xmodel,
                id = params.id,
                xmodelMap = _self.get('xmodelReadMap'),
                funcName = xmodelMap[xmodel];

            _self[funcName](params, callback);
        },

        _update: function(params, callback) {
            var _self = this,
                xmodel = params.xmodel,
                data = params.data,
                xmodelMap = _self.get('xmodelUpdateMap'),
                funcName = xmodelMap[xmodel];

            _self[funcName](data, callback);
        },

        _readDeskApp: function(params, callback) {
            var _self = this,
                appId = params.id,
                app = _self._findDeskApp(appId);

            callback(app);
        },

        _updateDeskApp: function(data, callback) {
            var _self = this,
                appId = data.appid,
                app = _self._findDeskApp(appId);

            for (var name in data) {
                app[name] = data[name];
            }

            callback(data);
        },

        _findDesk: function(index) {
            var _self = this,
                desks = _self.get('desks');

            return desks[index];
        },

        _findDeskApp: function(id) {
            var _self = this,
                allApps = _self._flattenDeskApps();

            return ServYou.Array.find(allApps, function(app) {
                if (app.appid == id) {
                    return true;
                }
            });
        },

        _findDomain: function() {

        },

        _findDomainApp: function() {

        },

        _flattenDeskApps: function() {
            var _self = this,
                desks = _self.get('desks'),
                ret = [],
                desk;

            for (var index in desks) {
                apps = desks[index];
                ServYou.each(apps, function(app) {
                    ret.push(app);
                    if (app.type == 'folder') {
                        ret = ret.concat(app.apps);
                    }
                })
            }

            return ret;
        }
    })
    proxy.SuiProxy = SuiProxy;

    ServYou.Proxy = proxy;
})()