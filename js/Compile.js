class Compile {
    constructor(el, vue) {
        this.$vue = vue; // 拷贝vue实例，之所以加$符号，表示暴露给用户的
        this.$el = document.querySelector(el);
        if(this.$el) {
            // 在$fragment中操作，比this.$el中操作节省很多性能，所以要赋值给fragment
            let $fragment = this.node2Fragment(this.$el); // 将vue模板的地方使用片段替代，这是为了便于在内存中操作
            this.compile($fragment);
            this.$el.appendChild($fragment); // 将替换好的片段追加到vue模板中去
        }
    }
    
    node2Fragment(el) {
        // 将node节点都放到fragment中去
        var fragment  = document.createDocumentFragment();
        var child;
         // 将原生节点拷贝到fragment
         while (child = el.firstChild) {
            fragment.appendChild(child);
        }
        return fragment;
    }

    compile(el) {
        var childNodes = el.childNodes;
        var that = this;
        childNodes.forEach(node => {
            var text = node.textContent;
            var reg = /\{\{(.*)\}\}/;
            if(node.nodeType === 1) {
                // 表示当前组件依然是一个html元素
                that.compileElement(node);
            } else if (node.nodeType === 3 && reg.test(text)) {
                // 当前为一个文本节点时，并且文本节点中包含{{}}
                that.compileText(node, RegExp.$1);
            }
        });
    }

    compileElement(node) {
        // compile使用来对html元素进行编译，因为html上可能被添加了一些vue的属性
        var nodeAttrs = node.attributes;
        var that = this;
        // Element.attributes 属性返回该元素所有属性节点的一个实时集合。该集合是一个 NamedNodeMap 对象，不是一个数组，所以它没有 数组 的方法，其包含的 属性 节点的索引顺序随浏览器不同而不同。更确切地说，attributes 是字符串形式的名/值对，每一对名/值对对应一个属性节点。所以这边不能够使用attributes.foreach
        [].slice.call(nodeAttrs).forEach(attr => {
            var attrName = attr.name;// 得到v-model
            if(attrName.indexOf('v-') == 0) {
                // 当为自定义的控件指令时
                var exp = attr.value; // 得到v-model = "name"中的model
                var val = that.$vue[exp]; // 得到name在$vue中存放的值
                node.value = val; // 绑定值到input上去
                node.addEventListener('input', (e) => {
                    var newValue = e.target.value;
                    if (val === newValue) {
                        return;
                    }
                    that.$vue[exp] = newValue;
                });
                node.removeAttribute(attrName);
            } else {

            }
        })
    }

    compileText(node, matchedName) {
        // 对包含可能出现vue标识的部分进行编译，主要是将{{xxx}}翻译成对应的值
        node.textContent = this.$vue[matchedName];
        new Watch(this.$vue, matchedName, function(value) {
            node.textContent = value;
        });
    }
}