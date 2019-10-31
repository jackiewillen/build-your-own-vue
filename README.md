任务清单：

1. 实现事件的绑定
   For example:

   HTML代码:
   <div>
        <button v-on:click="clickBtn">触发事件</button>
   </div>

   JS代码：
   var vm = new Vue({
       el: '#app',
       data: {
       },
       methods: {
            clickBtn: function(e) {
                console.log(e);
            }
        }
   })
   window.vm = vm; // 挂载到window上去
   