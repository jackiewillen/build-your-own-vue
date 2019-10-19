var compileUtil = {
    text: function(node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    }
}
class Compile {
    constructor(el, vm) {
        this.$vm = vm;
        this.$el = document.querySelector(el);
        if(this.$el) {
            // 在$fragment中操作，比this.$el中操作节省很多性能，所以要赋值给fragment
            $fragment = this.node2Fragment(this.$el);
            this.compileText($fragment);
        }
    }
    node2Fragment(el) {
        // 将node节点都放到fragment中去
        var fragment  = document.createDocumentFragment();
        fragment.appendChild(el.firstChild);// 将el中的元素放到fragment中去,并删除el中原有的，这个是appendChild自带的功能
        return fragment;
    }

    compileText(node) {
        // 对包含可能出现vue标识的部分进行编译，主要是将{{xxx}}翻译成对应的值
        var reg = /\{\(.*)\}\}/; // 用来判断有没有vue的双括号的
        if(reg.test(node.textContent)) {
            node.textContent = this.$vm[RegExp.$1];
            new Watch(this.$vm, exp, function(value) {
                node.textContent = value;
            });
        }
    }
}