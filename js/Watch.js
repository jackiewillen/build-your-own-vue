class Watch {
    constructor(vm, exp, cb) {
        this.vm = vm;
        this.cb = cb;
        this.getter = (vm) => { // 函数是为了稍后获得值使用的
            return vm[exp];
        };
        this.value = this.get();
    }
    get() {
        Dep.target = this;
        var value = this.getter.call(this.vm, this.vm);
        Dep.target = null;
        return value;
    }
    addDep(dep) {
        dep.addSub(this);
    }
}