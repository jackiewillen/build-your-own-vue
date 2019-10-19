class Observer {
    constructor(data) {
        this.data = data;
        this.defineReactive(data);
    }
    defineReactive(data) {
        Object.keys(data).forEach(key => {
            var dep  = new Dep();
            var val = data[key];
            Object.defineProperty(data, key, {
                enumerable: true,
                configurable: false,
                get() {
                    if(Dep.target) {
                        dep.depend();
                    }
                    return val;
                },
                set(newVal) {
                    if(newVal === val) {
                        return;
                    }
                    val = newVal;
                    dep.notify();
                }
            })
        });
    }
}