class Dep {
    constructor() {
        this.subs = [];
    }
    notify() {
        this.subs.forEach(sub => sub.update());
    }
    depend() {
        Dep.target.addDep(this);
    }
    addSub(sub) {
        this.subs.push(sub);
    }
}
Dep.target = null;