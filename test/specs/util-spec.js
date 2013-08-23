describe('测试 extend 继承', function() {

	function base() {
		this.name = 'base';
	}

	base.prototype = {
		method1: function() {

		}
	}

	var subClass = function() {
		this.name = 'subClass';
	}

	subClass.prototype = {
		method: function() {

		}
	}

	ServYou.extend(subClass, base, {
		method2: function() {

		}
	})

	var sub2 = ServYou.extend(subClass, {
		method3: function() {

		}
	});

	var obj = new subClass(),
		obj1 = new sub2();

	it('测试继承', function() {
		expect(obj instanceof base).toBe(true);
		expect(obj instanceof subClass).toBe(true);
		expect(obj1 instanceof subClass).toBe(true);
	});

	it('测试原有方法', function() {
		expect(obj.method).not.toBe(undefined);
	});

	it('测试继承的方法', function() {
		expect(obj.method1).not.toBe(undefined);
	});

	it('测试自定义的方法', function() {
		expect(obj.method2).not.toBe(undefined);
	});

	it('测试构造函数', function() {
		expect(obj.constructor).toBe(subClass);
	});

	it('测试调用父类的方法', function() {
		expect(obj.constructor.superclass.constructor).toBe(base);
	});

	it('测试直接生成子类', function() {
		expect(obj1.method1).not.toBe(undefined);
		expect(obj1.method2).not.toBe(undefined);
		expect(obj1.constructor.superclass.constructor).toBe(subClass);
	});

});

describe('测试 mixin 扩展', function() {

	function a() {

	}

	a.ATTRS = {
		p1: {
			v1:'1',
			v2:'2',
			v4:'4'
		}
	}

	function b() {

	}

	b.ATTRS = {
		p1 : {
			v1:'b1',
			v2:'b2',
			v3:'b3'
		},
		p2: {
			v:'b1'
		}
	}

	ServYou.augment(b,{
		m1: function() {

		}
	});

	ServYou.mixin(a, [b]);

	it('测试扩展方法', function() {
		var a1 = new a();
		expect(a1.m1).not.toBe(undefined);
	});

	it('测试扩展属性', function() {
		expect(a.ATTRS.p1.v1).toBe('1');
		expect(a.ATTRS.p1.v3).toBe('b3');
		expect(a.ATTRS.p1.v4).toBe('4');
		expect(a.ATTRS.p2.v).toBe('b1');
	})
});


describe('测试命名空间', function() {

	it('测试创建命名空间', function() {
		expect(ServYou.test).toBe(undefined);

		ServYou.namespace('test.unit');

		expect(ServYou.test).not.toBe(undefined);
		expect(ServYou.test.unit).not.toBe(undefined);

		ServYou.test.a = 'test';
		var obj = {};
		ServYou.test.obj = obj;
		ServYou.namespace('test.a');
		expect(ServYou.test.a).toBe('test');
		expect(ServYou.test.obj).toBe(obj);
	})
});

describe('测试原型链扩展', function() {

	it('测试扩展一个对象', function() {
		function a() {

		}

		ServYou.augment(a, {
			method1: function() {

			}
		});
		var a1 = new a();
		expect(a.method1).toBe(undefined);
		expect(a1.method1).not.toBe(undefined);
	});

	it('测试多个扩展', function() {
		function a() {

		}

		ServYou.augment(a, {
			method1: function() {
				return 1;
			}
		}, {
			method1: function() {
				return 2;
			},
			method2: function() {
				return 2;
			}
		});

		var a1 = new a();
		expect(a.method1).toBe(undefined);
		expect(a1.method1).not.toBe(undefined);
		expect(a1.method1()).toBe(2);

	})
});

describe('测试事件', function() {
	var A = function() {
		this.addEvents(['click', 'up']);
	}
	ServYou.extend(A, ServYou.Observable);

	var a = new A(),
		callback = jasmine.createSpy(),
		callback1 = jasmine.createSpy();

	a.on('click', callback);

	it('测试事件触发', function() {
		a.fire('click');
		expect(callback).toHaveBeenCalled();
	});

	it('测试移除事件', function() {
		callback.reset();
		a.off('click', callback);
		a.fire('click');
		expect(callback).not.toHaveBeenCalled();
	});

	it('测试添加多个事件', function() {
		a.on('up', callback);
		a.on('up', callback1);
		var obj = {a:123};
		a.fire('up', obj);
		expect(callback).toHaveBeenCalledWith(obj);
		expect(callback1).toHaveBeenCalledWith(obj);
	});

	it('移除所有事件', function() {
		callback.reset();
		a.clearListeners();
		a.fire('up');
		expect(callback).not.toHaveBeenCalled();
	});
});

describe('测试拷贝', function() {

});

describe('测试 Base 类', function() {

});

describe('测试UIBase 基类', function() {

});

describe('测试控件 基类 Controller', function() {

});

describe('测试 decorate', function() {

});

describe('测试控件查找', function() {

});

describe('测试JSON', function() {
	
})



