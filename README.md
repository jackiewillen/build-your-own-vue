任务清单：

1. 实现input和变量的双向绑定
   For example:

   HTML代码:
   <div>
        {{name}}
        <input type="text" v-model="name">
   </div>

   JS代码：
   var vm = new Vue({
       el: '#app',
       data: {
           name: 'jackie'
       }
   })
   window.vm = vm; // 挂载到window上去

   Console控制台：
   vm.name = 'willen'; // 改变会自动同步到各个组件上去