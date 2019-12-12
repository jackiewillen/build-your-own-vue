Vue最精华的部分就是双向绑定，在双向绑定的基础上，又写了computed，watch, methods等方法。所以要看懂Vue内核，那第一步肯定就是要了解Vue双向绑定的原理，但是说实话，看了网上很多，好多代码都是经过重构优化后的代码，失去了代码原始的面貌，不太易于理解。所以决定写一个原始一点但是又尽可能简洁一点的，但是原理绝对是Vue双向绑定的原理，确保你看懂这篇文章，就能够了解Vue内核。采用最少的代码，来实现一个个功能。有什么写的不妥的地方，烦请在仓库issue中指出，我好及时修正。
这个项目的github地址为[build-your-own-vue](https://github.com/jackiewillen/build-your-own-vue)

如果你对当前流行的轮子的原理感兴趣，下面还有这些你也可以看看，有疑问欢迎在各个仓库下留言：

[build-your-own-react](https://github.com/jackiewillen/build-your-own-react)

[build-your-own-vuex](https://github.com/jackiewillen/build-your-own-vuex)

[build-your-own-redux](https://github.com/jackiewillen/build-your-own-redux)

[build-your-own-flux](https://github.com/jackiewillen/build-your-own-flux)

接下来所讲的这些就为了实现下面这个简单的双向绑定：

		<div id="app">
		    {{name}}
		</div>
		<script type="text/javascript">
		    let vue = new Vue({
		        el: '#app',
		        data: {
		            name: 'jackieyin'
		        }
		    })
		    window.vue = vue;
		</script>

在chrome devtools控制台中通过this.vue.name = 'willen'可以自动更新页面中的name为’willen‘。看看结果：

![双向绑定结果](https://github.com/jackiewillen/blog/blob/master/images/%E5%8F%8C%E5%90%91%E7%BB%91%E5%AE%9A.gif?raw=true)


（1）从最容易的Dependency.js开始说。

先来看代码：

		let Watcher = null; // 用来表明有没有监视器实例，这会你可能不懂，下面会遇到它，然后讲解
		class Dep { // 把与一个变量相关的监听器都存在subs这个变量中
		    constructor() {
		        this.subs = []; // 定义一个subs容器
		    }
		    notify() {
		        // 执行所有与变量相关的回调函数，容器中的watcher一个个都执行掉（看不懂watcher没关系，第二结中就会讲解）
		        this.subs.forEach(sub => sub.update());
		    }
		    addSub(watcher) { // 将一个一个的watcher放入到sub的容器中（看不懂watcher没关系，第二结中就会讲解）
		        // 添加与变量相关的订阅回调
		        this.subs.push(watcher);
		    }
		}

从代码看下来，Dep就是subs容器,是一个数组，将一个个的watcher都放到subs容器中。watcher就是一个个的回调函数，都放在subs的容器中等待触发。addSub中的this.subs.push(watcher)就是将一个个的watcher回调函数放入到其中。notify就是用来将subs中的watcher都触发掉。watcher中就是一个一个更新页面中对应的变量的函数。这个下面会说到。



（2）接下来就看看这个watcher是什么？

		class Watch {
		    constructor(vue, exp, cb) {
		        this.vue = vue; // 将vue实例传入到watcher中
		        this.exp = exp; // 需要对那个表达式进行监控，比如对上例中的'name'进行监控，那么这里的exp就是'name'
		        this.cb = cb; // 一但监听到上述exp表达式子的值发生变化，需要通知到的cb(callback)回调函数
		        this.hasAddedAsSub = false; // 有没有被添加到Dep中的Subscriber中去，有的话就不需要重复添加
		        this.value = this.get(); // 得到当前vue实例上对应表达式exp的最新的值
		    }
		    get() {
		        Watcher = this; // 这边的Watcher为什么需要放入this,并在下面又置空，你需要继续向下看，暂且先记着，这边把现在的watcher实例放到了Watcher中了。
		            var value = this.vue[this.exp]; // 得到表达式的值，就是得到'name'表达式的值为‘willen’(通过chrome devtools控制台中通过this.vue.name = 'willen'修改了name为’willen‘。)
		        Watcher = null; // 将Watcher置空，让给下一个值
		        return value; // 将获取到的表达式的值返回出去
		    }
		    update() {
		        let value = this.get(); // 通过get()函数得到当前的watcher监听的表达式的值，例如上面的‘willen’
		        let oldVal = this.value; // 获取旧的值
		        if(value !== oldVal) {  // 对比新旧表达式‘name’的值，发现修改前为'jackieyin',修改后为'willen',说明需要更新页面
		            this.value = value; // 把现在的值记录下来，用于和下次比较。
		            this.cb.call(this.vue, value); // 用现在的值willen去执行回调函数，其实就是更新一下页面中的{{name}}从‘jackieyin’ 为‘willen’
		        }
		    }
		}

(3) 接下来看一下Observer，这个类是做什么工作的。

		class Observer {
		    constructor(data) {
		        this.defineReactive(data); // 将用户自定义的data中的元素都进行劫持观察，从而来实现双向绑定
		    }
		    defineReactive(data) { // 开始对用户定义的数据进行劫持
		        var dep  = new Dep(); //这个就是第一节中提及到的Dependency类。用来收集双向绑定的各个数据变化时都有的依赖watcher
		        Object.keys(data).forEach(key => { // 遍历用户定义的data,其实现在也就一个‘name’字段
		            var val = data[key]; // 得到data['name']的值为jackieyin
		            Object.defineProperty(data, key, {
		                get() { // 使用get对data中的name字段进行劫持
		                    if(Watcher) { // 这个就是第二结中提及的Watcher了，(第二结中Watcher = this赋值后这边才会进入if)
		                        if(!Watcher.hasAddedAsSub) { // 对于已经添加到订阅列表中的监视器则无需再重复添加了,防止将watcher重复添加到subs容器中，没有意义，因为一会儿更新{{name}}从‘jackieyin’到‘willen’，更新两三次也还还是一个结果
		                            dep.addSub(Watcher); // 将监视器watcher添加到subs订阅列表中
		                            Watcher.hasAddedAsSub = true;  // 表明这个结果已经添加到subs容器中了
		                        }
		                    }
		                    return val; // 将name中的值返回出去
		                },
		                set(newVal) { // 对this.vue.name = 'willen'这个set行为进行劫持
		                    if(newVal === val) { // 新值（例如还是this.vue.name = 'jackieyin'）与之前的值相同，不做任何修改
		                        return;
		                    }
		                    val = newVal; // 将vue实例上对应的值(name的值)修改为新的值
		                    dep.notify(); // 通知subs中watcher都触发来对页面进行更新，将页面中的{{name}}处的‘jackieyin’更新为'willen'
		                }
		            })
		        });
		    }
		}
		
(4) 最后再一起来看看编译类Compile，这个是用来对{{name}}进行编译，说白了就是在你的实例的data对象中，找到name: 'jackieyin',然后在页面上将{{name}}替换为‘jackieyin’

		class Compile {
		    constructor(el, vue) {
		        this.$vue = vue; // 拷贝vue实例，之所以加$符号，表示暴露给用户的，经常在Vue中看到这种带$标志的，说明是暴露给用户使用的。
		        this.$el = document.querySelector(el); // 获取到dom对象，其实就是document.querySelector('#app'); 
		        if(this.$el) { // 如果存在可以挂在的实例
		            // 在$fragment中操作，比this.$el中操作节省很多性能，所以要赋值给fragment
		            let $fragment = this.node2Fragment(this.$el); // 将获取到的el的地方使用片段替代，这是为了便于在内存中操作,使得更新页面更加快速
		            this.compileText($fragment.childNodes[0]); // 将模板中的{{}}替换成对应的变量，如{{name}}替换为'jackieyin'
		            this.$el.appendChild($fragment); // 将el获取到的dom节点使用内存中的片段进行替换
		        }
		    }
		    node2Fragment(el) { // 用来把dom中的节点赋值到内存fragment变量中去
		        // 将node节点都放到fragment中去
		        var fragment  = document.createDocumentFragment();
		        fragment.appendChild(el.firstChild);// 将el中的元素放到fragment中去,并删除el中原有的，这个是appendChild自带的功能
		        return fragment;
		    }
		
		    compileText(node) {
		        // 对包含可能出现vue标识的部分进行编译，主要是将{{xxx}}替换成对应的值，这边是用正则表达式检测{{}}进行替换
		        var reg = /\{\{(.*)\}\}/; // 用来判断有没有vue的双括号的
		        if(reg.test(node.textContent)) {
		            let matchedName = RegExp.$1;
		            node.textContent = this.$vue[matchedName];
		            new Watch(this.$vue, matchedName, function(value) { // 对当前的表达式‘name’添加watcher监听器，其实后来就是把这个watcher放入到了dep中的subs的数组中了。当'name'更新为‘willen’后，其实就是执行了这边的node.textContent = value就把页面中的jackieyin替换成了willen了。这就是双向绑定了。node其实就是刚才存放在内存中的$fragement的节点，所以相当于直接操作了内存，所以更新页面就比修改DOM更新页面快多了。
		                node.textContent = value;
		            });
		        }
		    }
		}
		
(5)这个时候就可以来组装出一个我们自己的小型的Vue了。

		class Vue {
		    constructor(options) {
		        let data = this._data = options.data || undefined;
		        this._initData(); // 将data中的数据都挂载到this上去，使得this.name 相当于就是得到了this._data.name
		        new Observer(data); // 将data中的数据进行劫持
		        new Compile(options.el, this); // 将{{name}}用data中的’jackieyin‘数据替换掉
		    }
		    _initData() {
		        // 这个函数的功能很简单，就是把用户定义在data中的变量，都挂载到Vue实例(this)上
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
		}
(6)大功告成，把我们所写的零件组装在一起试一下我们的小型的vue是否工作正常。

		<!DOCTYPE html>
		<html lang="en">
		<head>
		    <meta charset="UTF-8">
		    <title>Document</title>
		</head>
		<body>
		    <div id="app">
		        {{name}}
		    </div>
		    <script src="./js/Dependency.js"></script>
		    <script src="./js/Observer.js"></script>
		    <script src="./js/Watch.js"></script>
		    <script src="./js/Compile.js"></script>
		    <script src="./js/Vue.js"></script>
		    <script type="text/javascript">
		        let vue = new Vue({
		            el: '#app',
		            data: {
		                name: 'jackie'
		            }
		        })
		        window.vue = vue;
		    </script>
		</body>
		</html>
		
![双向绑定结果](https://github.com/jackiewillen/blog/blob/master/images/%E5%8F%8C%E5%90%91%E7%BB%91%E5%AE%9A.gif?raw=true)

怎么样，搞定了，其实，这只是Vue的冰山一角，在这个仓库中还实现了一系列vue的功能，如果你有兴趣可以一个commit一个commit的往下看，每个commit都只实现一个完整的细小的功能，而且代码量都尽可能的少，你如果想看一定能看懂。这仓库都是没有使用虚拟DOM来实现，更新颗粒度细，现在的Vue降低了更新的颗粒度，用了虚拟DOM，但是Vue中双向绑定的原理始终未变，所以这篇文章还是需要看懂的，老弟。以后有时间我再研究研究虚拟DOM写个仓库。

![123](https://github.com/jackiewillen/blog/blob/master/images/%E5%B0%8F%E5%9E%8Bvue.png?raw=true)

如发现文章有什么错误，可以在 [我的github中](https://github.com/jackiewillen/blog/issues/20)进行评论留言。如果你觉的文章写的还可以， [欢迎star](https://github.com/jackiewillen/blog/issues/20)

[文章vue内核仓库地址](https://github.com/jackiewillen/build-your-own-vue)
