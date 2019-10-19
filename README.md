任务清单：

1. 实现一个变量，使控制台中对变量进行修改能够监听到
   For example:

   HTML代码:
   <div>
        {{name}}
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
   vm.name = 'willen'; // 改变会自动同步到页面上