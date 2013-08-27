describe('测试model', function(){

	var AppModel = ServYou.AppModel;

	it('测试 fetch', function() {
		var a = new AppModel({
			id:'000P07'
		});
		expect(a.get('name')).toBe(null);

		a.fetch();

		expect(a.get('name')).not.toBe(null);
	});

	it('测试实例化model属性', function() {
		var name = 'appName',
			icon = 'icon';

		var a = new AppModel({
			name: name,
			icon: icon
		})

		expect(a.get('name')).toBe(name);
		expect(a.get('icon')).toBe(icon);
	})

	it('测试toJSON方法', function() {
		var json = {
			id: 1,
			name:'name',
			icon:'icon',
			url:'123'
		};

		var a = new AppModel(json);

		var toJson = a.toJSON();

		expect(typeof toJson).toBe('object');
		var f = 0;
		for (var j in json) {
			if (toJson[j] == json[j]) {
				f++
			}
		}

		expect(f).toBe(4);
	})

	it('测试set方法', function() {
		var a = new AppModel({
			name: '12'
		});

		expect(a.get('name')).toBe('12');

		a.set('name', '14');

		expect(a.get('name')).toBe('14');
	});

	it('测试hasChaned方法', function() {
		var a = new AppModel({
			name: '15'
		});

		expect(a.get('name')).toBe('15');
		expect(a.hasChanged('name')).toBe(false);

		a.set('name', '16');
		expect(a.get('name')).toBe('16');
		expect(a.hasChanged('name')).toBe(true);
	});

	it('测试save方法', function() {
		var a = new AppModel({
			id:'000P07'
		});

		var afterName;

		a.on('afterSaved', function(data) {
			afterName = data.name
		});

		a.fetch();

		a.set('name', '角色扮演');
		a.save();

		expect(afterName).toBe('角色扮演');
	});

	it('测试isNew', function() {
		var a = new AppModel({
			id:'000P07'
		});
		expect(a.get('isNew')).toBe(true);

		a.fetch();

		expect(a.get('name')).not.toBe(null);
		expect(a.get('isNew')).toBe(false);
	})
});