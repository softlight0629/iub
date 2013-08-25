(function() {

	var UIBase = ServYou.UIBase;

	ServYou.mix(UIBase, {
		Tpl: ServYou.tpl
	})

	ServYou.mix(UIBase, {
		TplView: UIBase.Tpl.View
	})
})()