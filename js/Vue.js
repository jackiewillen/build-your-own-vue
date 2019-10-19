class Vue {
    constructor(options) {
        this.$options = options || {};
        this._data = data = this.$options.data;
        this._initData(); // 将data中的数据都挂载到this上去
        new Observer(data, this);
        this.$compile = new Compile(options.el, this);
    }
    _initData() {
        let that = this;
        Object.keys(that._data).forEach((key) => {
            Object.defineProperty(that, key, {
                configurable: false,
                enumerable: false,
                get: () => {
                    return that._data[key];
                },
                set: (newVal) => {
                    that._data[key] = newVal;
                }
            })
        });
    }
}