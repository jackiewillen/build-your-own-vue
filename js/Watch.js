class Watch {
    constructor(vue, exp, cb) {
        this.vue = vue;
        this.exp = exp;
        this.cb = cb;
        Watcher = this; // 将当前实例watch放入到Watcher中，移动到这是为了防止update调用get时，反复向Dep依赖中添加
        this.value = this.get(); // 得到当前vue实例上对应表达式exp的最新的值
        Watcher = null; // 将Watcher置空，让给下一个值
    }
    get() {
        var exps = this.exp.split('.');
        var obj = this.vue;
        for (var i = 0, len = exps.length; i < len; i++) {
            if (!obj) return;
            obj = obj[exps[i]];
        }
        var value = obj;
        return value;
    }
    update() {
        let value = this.get();
        let oldVal = this.value;
        if(value !== oldVal) {  
            this.value = value;
            this.cb.call(this.vue, value); // 将于此变量相关的回调函数全部执行掉
        }
    }
}