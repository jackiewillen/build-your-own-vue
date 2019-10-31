任务清单：

1. 实现对于值的多层级的查找
   For example:

   HTML代码:
   <div>
        {{dog.name}}
        <input type="text" v-model="dog.name">
   </div>

   JS代码：
   var vm = new Vue({
       el: '#app',
       data: {
            dog: {
                name: 'titi',
                age: 2
            }
       }
   })
   window.vm = vm; // 挂载到window上去

   input中的修改可以实现双向绑定

   得到的结论：
   （1）给 object 的子添加的watch同时会添加到父中去例如
   dog: {   <------child watch
       name: 'titi'    <---child watch
   }
   所以修改父的时候子的watch也会触发，这就是为什么this.dog = '123'的时候，dog.name的地方也双向绑定自动变成了undefined,通过this.$set设置的新的属性同样也会把watch设置到层层的父级上，这样一旦修改了父的，子的也会触发更新。

   （2）当父添加watch时，只对于父添加Watch
   dog: {   <------ watch
       name: 'titi'
   }
   所以父不会影响到子的。

   总结下来就是从当前层向上都会埋下watch, 向下都不会有这个watch,因为向下的都没有使用过，所以也没有必要埋下watch;