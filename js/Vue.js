class Vue {
    constructor(options) {
        this.$options =  options || {};
        let data = this._data = options.data || undefined;
        this._initData(); // 将data中的数据都挂载到this上去
        this._initComputed();// 将data中的计算属性挂载到this上去
        new Observer(data); // 将data中的数据都进行双向绑定监控
        this._initWatch(); // 添加监控到对应的变量下
        new Compile(options.el, this); // 将{{name}}这样的模板，使用data中的数据替换掉
    }
    _initData() {
        // 这个函数的功能很简单，就是把用户定义在data中的变量，都挂载到Vue实例上
        let that = this;
        Object.keys(that._data).forEach((key) => {
            Object.defineProperty(that, key, {
                get: () => {
                    return that._data[key];
                },
                set: (newVal) => {
                    that._data[key] = newVal;
                }
            })
        });
    }
    _initComputed() {
        var that = this;
        var computed = that.$options.computed || {};
        Object.keys(computed).forEach(function(key) {
            Object.defineProperty(that, key, {
                get: computed[key],
                set: function() {}
            });
        });
    }
    _initWatch() {
        var that = this;
        var watch = that.$options.watch;
        Object.keys(watch).forEach(function(key) {
            new Watch(that, key, watch[key]);
        })
    }
}