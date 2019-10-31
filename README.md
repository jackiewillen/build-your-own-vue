任务清单：

1. 实现动态的class
   For example:

   HTML代码:
   <div>
        <p v-bind:class="className" class="abc">
            1234
        </p>
   </div>

   JS代码：
   var vm = new Vue({
       el: '#app',
       data: {
           className: 'my-class'
       }
   })
   window.vm = vm; // 挂载到window上去
   