(function() {
	var Component = {};

	ServYou.mix(Component, {
		Manager: ServYou.Manager,
		UIBase: ServYou.UIBase,
		View: ServYou.View,
		Controller: ServYou.Controller
	});

	function create(component, self) {
		var childConstructor, xclass;
		if (component && (xclass = component.xclass)) {
			if (self && !component.prefixCls) {
				component.prefixCls = self.get('prefixCls');
			}
			childConstructor = Component.Manager.getConstructorByXClass(xclass);
			if (!childConstructor) {
				ServYou.error('can not find class by xlass desc :' + xclass);
			}
			component = new childConstructor(component);
		}
		return component;
	}

	Component.create = create;

	ServYou.Component = Component;
})()