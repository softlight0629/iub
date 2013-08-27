(function() {

    var Proxy = ServYou.Proxy,
        AbstractModel = ServYou.AbstractModel;

    function AppModel(config) {
        AppModel.superclass.constructor.call(this, config);
    }

    AppModel.ATTRS = {
        id:{
            persist:1,
            value:null
        },

        icon:{
            persist:1,
            value:null
        },

        type: {
            persist:1,
            value:null
        },

        url:{
            persist:1,
            value:null
        },

        name: {
            persist:1,
            value:null
        },

        dataMap : {
           value: {
            'id' : 'appid'
           }
        },

        idAttr: {
            value:'id'
        },

        xmodel: {
            value:'desk-app'
        },

        store: {
            value:new Proxy.SuiProxy()
        }
    }

    ServYou.extend(AppModel, AbstractModel);

    ServYou.augment(AppModel, 
    {
        
    });

    ServYou.AppModel = AppModel;

})()