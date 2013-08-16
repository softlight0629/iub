(function() {

    var Callback = function() {
        this._init();
    }

    ServYou.augment(Callback, 
    {
        _functions: null,

        _init: function() {
            this._functions = [];
        },

        add: function(fn) {
            this._functions.push(fn);
        },

        remove: function(fn) {
            var functions = this._functions,
                index = ServYou.Array.indexOf(fn , functions);

            if (index >= 0) {
                functions.splice(index, 1);
            }
        },

        empty: function() {
            var length = this._functions.length;
            this._functions.splice(0, length);
        },

        fireWith: function(scope, args) {
            var _self = this,
                rst;

            ServYou.each(_self._functions, function(fn) {
                rst = fn.apply(scope, args);
                if (rst === false) {
                    return false;
                }
            })

            return rst;
        }
    });

    function getCallbacks() {
        return new Callback();
    }


    var Observable = function(config) {
        this._events = [];
        this._eventsMap = {};
        this.bullesEvents = [];
        this._initEvents(config);
    }

    ServYou.augment(Observable, 
    {
        _getCallback: function(eventType) {
            var _self = this,
                eventsMap = _self._eventsMap;

            return eventsMap[eventType];
        },

        _initEvents: function(config) {
            var _self = this,
                listeners = null;

            if (!config) {
                return;
            }

            listeners = config.listeners || {};

            if (config.handler) {
                listeners.click = config.handler;
            }

            if (listeners) {
                for (var name in listeners) {
                    if (listeners.hasOwnProperty(name)) {
                        _self.on(name, listeners[name]);
                    }
                }
            }
        },

        addEvents: function(events) {
            var _self = this,
                existsEvents = _self._events,
                eventsMap = _self.eventsMap;

            function addEvent(eventType, fn) {
                if (ServYou.Array.indexOf(eventType, existsEvents) === -1) {
                    eventsMap[eventType] = getCallbacks();
                    existsEvents.push(eventType);
                }
            }

            if (ServYou.isArray(events)) {
                $.each(events, function(eventType, fn) {
                    addEvent(eventType, fn);
                })
            } else {
                addEvent(eventType, fn);
            }
        },

        on: function(eventType, fn){
            var arr = eventType.split(' '),
                _self = this,
                callback = null;

            if (arr.length > 1) {
                $.each(arr, function(eventType) {
                    _self.on(eventType, fn);
                });
            } else {
                callback = _self._getCallback(eventType);
                if (callback) {
                    callback.add(fn);
                } else {
                    _self.addEvents(eventType, fn);
                    _self.on(eventType, fn);
                }
            }

            return _self;
        },

        off: function(eventType, fn) {
            if (!eventType && !fn) {
                this.clearListeners();
                return this;
            }

            var _self = this,
                callbacks = _self._getCallback(eventType);

            if (callbacks) {
                callbacks.remove(fn);
            }
            return _self;
        },

        fire: function() {

        },

        clearListeners: function() {

        },

        publish: function() {

        }
    });

})()