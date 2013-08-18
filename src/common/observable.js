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
        this._bullesEvents = [];
        this._initEvents(config);
    }

    ServYou.augment(Observable, 
    {
        _events: [],

        _eventsMap: {},

        _bullesEvents: [],

        _bubbleTarget: null,

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

        fire: function(eventType, eventData) {
            var _self = this,
                callbacks = _getCallback(eventType),
                args = $.makeArray(arguments),
                result;

            if (!eventData) {
                eventData = {};
                args.push(eventData);
            }

            if (!eventData.target) {
                eventData.target = _self;
            }

            if (callbacks) {
                result = callbacks.fireWith(_self, Array.prototype.slice.call(args, 1));
            }

            if (_self._isBubbles(eventType)) {
                var _bubbleTarget = _self._bubbleTarget;
                if (_bubbleTarget && _bubbleTarget.fire) {
                    _bubbleTarget.fire(eventType, eventData);
                }
            }

            return result;
        },

        _isBubbles: function(eventType) {
            return ServYou.Array.indexOf(eventType, this._bubblesEvents) >= 0;
        },

        clearListeners: function() {
            var _self = this,
                eventsMap = _self._eventsMap;
            for (var name in eventsMap) {
                if (eventsMap.hasOwnProperty(name)) {
                    eventsMap[name].empty();
                }
            }
        },

        publish: function(eventType, cfg) {
            var _self = this,
                bubblesEvents = _self._bubblesEvents;

            if (cfg.bubbles) {
                if (ServYou.Array.indexOf(eventType, bubblesEvents) === -1) {
                    bubblesEvents.push(eventType);
                }
            } else {
                var index = ServYou.Array.indexOf(eventType, bubblesEvents);
                if (index !== -1) {
                    bubblesEvents.splice(index, 1);
                }
            }
        }
    });

    ServYou.Observable = Observable;

})()