任务清单：

1. 实现动态的class
   For example:

   HTML代码:
   <div>
        {{getComputedVal}}
   </div>

   JS代码：
   var vm = new Vue({
       el: '#app',
       data: {
            str: 'jackie'
        },
        computed: {
            getComputedVal: function() {
                return this.str + ' ' + 'willen';
            }
        }
   })
   window.vm = vm; // 挂载到window上去
   
   有一个疑问：
   为什么动态修改this.str，后getComputedVal在页面的值也能够做到双向绑定。

   解答：
   因为其实计算属性的watch监控安放到了他所依赖的所有的data数据下，如上文就安放到了data.str下，所以一旦data.str被修改，那么计算属性的watch也就被触发，去重新获取值渲染页面了。计算属性引用多少个data的属性，他的watch也就会被安放到多少个data的属性中。

   不得不说，Vue这样的设计真的很巧妙。
   比如： 
   computed: {
        getComputedVal: function() {
            return this.a + this.b + this.c' ' + 'willen';
        }
    }
    那么计算属性的监听器就会被放到a,b,c三个的依赖收集器中，只要a,b,c中有任何一个修改了，computed属性在界面中都会自动更新
    
   vue中的双向绑定是不会对计算属性起作用的，因为计算属性监听都绑定到了data对应的属性值上去了