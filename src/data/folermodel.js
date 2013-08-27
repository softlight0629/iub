(function() {
	var ContainerableModel = ServYou.ContainerableModel,
		AppModel = ServYou.AppModel;

	var FolderModel = function(config) {
		FolderModel.superclass.constructor.call(this, config);

		ContainerableModel.call(this, config);
	}

	FolderModel.ATTRS = {

	}

	ServYou.extend(FolderModel, AppModel);

	ServYou.mixin(FolderModel, ContainerableModel);

	ServYou.augment(FolderModel, {
		
	})
})()