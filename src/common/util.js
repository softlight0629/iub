
var ServYou = ServYou || {};

(function() {

    var toString = Object.prototype.toString,
        ATTRS = 'ATTRS';

    $.extend(ServYou, 
    {
        isFunction: function(fn) {
            return typeof(fn) === "function";
        },

        isArray: function(arr) {
            return toString.call(arr) === "[object Array]";
        },

        isNumber: function(number) {
            return toString.call(number) === "[object Number]";
        },

        isString: function(str) {
            return toString.call(str) === "[object String]";
        },

        isDate: function(date) {
            return toString.call(date) === "[object Date]";
        },

        namespace: function(name, baseName) {
            var baseName = baseName || ServYou;

            if (!name) {
                return ServYou;
            }

            var list = name.split('.'),
                curNs = baseName;

            for (var i = 0; i < list.length; i++) {
                var nsName = list[i];
                if (!curNs[nsName]) {
                    curNs[nsName] = {};
                }
                curNs = curNs[nsName];
            }

            return curNs;
        },

        app: function(name) {
            if (!window[name]) {
                window[name] = {
                    namespace : function(nsName) {
                        return ServYou.namespace(nsName, window[name]);
                    }
                }
            }
        },

        cloneObject: function(obj) {
            var result = ServYou.isArray ? [] : {};
            return ServYou.mix(true, result, obj)
        },

        extend: function(subclass, superclass, overrides, staticOverrides) {

            if (!ServYou.isFunction(superclass)) {
                superclass = subclass;
                overrides = superclass;
                subclass = function() {}
            }

            var create = Object.create ?
                function (proto, subclass) {
                    return Object.create(proto, 
                    {
                        constructor:{
                            value: subclass
                        }
                    })
                } :

                function(proto, subclass) {
                    function F(){};
                    F.prototype = proto;
                    subclass.prototype = new F();
                    subclass.constructor = subclass;
                }

            var superObj = create(superclass.prototype, subclass);
            subclass.prototype = ServYou.mix(superObj, subclass.prototype);
            subclass.superclass = create(superclass.prototype, superclass);

            ServYou.mix(superObj, overrides);
            ServYou.mix(subclass, staticOverrides);

            return subclass;

        },

        mix: function() {
            return $.extend.apply(null, arguments);
        },

        merge: function() {
            var args = $.makeArray(arguments);
            args.unshift({});
            return ServYou.mix.apply(null, args);
        },

        mixin: function(c, mixins, attrs) {
            attrs = attrs || [ATTRS];
            var extensions = mixins;

            if (extensions) {
                c.mixins = extensions;

                var desc = {}, constructors = extensions['concat'](c);

                ServYou.each(constructors, function(ext) {
                    if (ext) {

                        ServYou.each(attrs, function(attr) {
                            if (ext[attr]) {
                                desc[attr] = desc[attr] || {};

                                ServYou.mix(true, desc[attr], ext[attr]);
                            }

                        })
                    }
                })

                ServYou.each(desc, function(v, k) {
                    c[k] = desc[k];
                })

                var prototype = {};

                ServYou.each(constructors, function(ext) {
                    if (ext) {
                        var proto = ext.prototype
                        for (var p in proto) {

                            if (proto.hasOwnProperty(p)) {
                                prototype[p] = proto[p];
                            }
                        }
                    }
                });

                ServYou.each(prototype, function(v, k) {
                    c.prototype[k] = prototype[k];
                })
            }

            return c;
           
        },

        augment: function(r, s1) {
            if (!ServYou.isFunction(r)) {
                return r;
            }

            for (var i = 1; i < arguments.length; i++) {
                ServYou.mix(r.prototype, arguments[i].prototype || arguments[i]);
            }

            return r;
        },

        each: function(elements, fn) {
            if (!elements) {
                return;
            }

            $.each(elements, function(k, v) {
                return fn(v, k)
            });
        },

        /**
         * 获取窗口可视范围宽度
         * @return {Number} 可视区宽度
         */
        viewportWidth : function(){
            return $(window).width();
        },
        /**
         * 获取窗口可视范围高度
         * @return {Number} 可视区高度
         */
        viewportHeight:function(){
             return $(window).height();
        },
        /**
         * 滚动到窗口的left位置
         */
        scrollLeft : function(){
            return $(window).scrollLeft();
        },
        /**
         * 滚动到横向位置
         */
        scrollTop : function(){
            return $(window).scrollTop();
        },
        /**
         * 窗口宽度
         * @return {Number} 窗口宽度
         */
        docWidth : function(){
            var body = document.documentElement || document.body;
            return $(body).width();
        },
        /**
         * 窗口高度
         * @return {Number} 窗口高度
         */
        docHeight : function(){
            var body = document.documentElement || document.body;
            return $(body).height();
        }

    })
})()