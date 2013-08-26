(function() {

	var AbstractModel = ServYou.AbstractModel;

	function AppModel(config) {
		AppModel.superclass.constructor.call(this, config);
	}

	AppModel.ATTRS = {
		id:{
			persist:1
			value:{}
		},

		icon:{
			persist:1
			value:{}
		},

		url:{
			persist:1
			value:{}
		},

		name: {
			persist:1
			value:{}
		},

		dataMap : {
			
		}

		idAttr: 'id'

		xmodel: 'desk-app',

		store: new Store();
	}

	ServYou.extend(AppModel, AbstractModel);

	ServYou.augment(AppModel, {

	})

})()