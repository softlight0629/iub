(function() {

    var Base = ServYou.Base;

    function AbstractModel(config) {
        AbstractModel.superclass.constructor.call(this, config);
        this._onChangeListener();
    }

    AbstractModel.ATTRS = {

        isNew: {
            value: true
        },

        fetched: {
            value:false
        },

        changed: {
            value: {}
        }
    }

    ServYou.extend(AbstractModel, Base);

    ServYou.augment(AbstractModel, {

        isModel: true,

        _onChangeListener: function() {
            var _self = this,
                persistAttrs = _self.getPersistAttrs(),
                changed = _self.get('changed');

            ServYou.each(persistAttrs, function(val, name) {
                _self.on('after' + ServYou.ucfirst(name) + 'Change', function() {
                    changed[name] = true;
                })
            });
        },

        fetch: function() {
            var _self = this,
                store = _self.get('store'),
                idAttr = _self.get('idAttr');

            store.read({
                xmodel:_self.get('xmodel'),
                id:_self.get(idAttr)
            }, _self.parse, _self);

            _self.set('fetched', true);
            _self.set('isNew', false);
            _self.set('changed', {});
        },

        save: function() {
            var _self = this,
                xmodel = _self.get('xmodel'),
                isNew = _self.get('isNew'),
                dataMap = _self.get('dataMap') || {},
                changed = _self.hasChanged(),
                store = _self.get('store'),
                data = _self.toJSON();

            for (var name in data) {
                if (dataMap.hasOwnProperty(name)) {
                    data[dataMap[name]] = data[name];
                    delete data[name];
                }
            }

            store.update({
                xmodel: xmodel,
                isNew: isNew,
                changed: changed,
                data: data
            }, function(data) {
                _self._afterSaved(data);
                _self.fire('afterSaved', data);
                _self.set('isNew', false);
                _self.set('changed', {});
            }, _self);
        },

        isNew: function() {
            return this.get('isNew');
        },

        hasChanged: function(name) {
            var _self = this,
                changed = _self.get('changed');

            if (ServYou.isNull(name)) {
                return ServYou.isEmpty(changed);
            } 

            return !ServYou.isNull(changed[name]);
        },

        sync: function() {

        },

        toJSON: function() {
            var _self = this,
                persistAttrs = _self.getPersistAttrs(),
                ret = {};

            ServYou.each(persistAttrs, function(val, name) {
                ret[name] = _self.get(name);
            });

            return ret;
        },

        escape: function(name) {
            var _self = this;

            return ServYou.escape(_self.get(name));
        },

        getPersistAttrs: function() {
            var _self = this,
                attrs = _self.getAttrs(),
                ret = {};

            ServYou.each(attrs, function(val, name) {
                if (val.persist) {
                    ret[name] = val;
                }
            });

            return ret;

        },

        parse: function(data, options) {
            var _self = this,
                persistAttrs = _self.getPersistAttrs(),
                dataMap = _self.get('dataMap') || {},
                options = options || {},
                attr,
                val;

            if (!data) {
                return;
            }

            for (attr in persistAttrs) {
                val = data[dataMap[attr]] || data[attr];
                if (!ServYou.isNull(val)) {
                    _self.set(attr, val, options);
                }
            }

        },

        _afterSaved: function(data) {

        }
    });

    ServYou.AbstractModel = AbstractModel;

})()