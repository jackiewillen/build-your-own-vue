class Compile {
    constructor(el, vue) {
        this.$vue = vue; // 拷贝vue实例，之所以加$符号，表示暴露给用户的
        this.$el = document.querySelector(el);
        if(this.$el) {
            // 在$fragment中操作，比this.$el中操作节省很多性能，所以要赋值给fragment
            let $fragment = this.node2Fragment(this.$el); // 将vue模板的地方使用片段替代，这是为了便于在内存中操作
            this.compileText($fragment.childNodes[0]); // 将模板中的{{}}替换成对应的变量
            this.$el.appendChild($fragment); // 将替换好的片段追加到vue模板中去
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
        var reg = /\{\{(.*)\}\}/; // 用来判断有没有vue的双括号的
        if(reg.test(node.textContent)) {
            let matchedName = RegExp.$1;
            node.textContent = this.$vue[matchedName];
            new Watch(this.$vue, matchedName, function(value) {
                node.textContent = value;
            });
        }
    }
}