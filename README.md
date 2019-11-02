任务清单：

1. 实现动态的class
   For example:

   HTML代码:
   <div>
        {{str}}
   </div>

   JS代码：
   let vue = new Vue({
        el: '#app',
        data: {
            str: 'jackie'
        },
        watch: {
            str: function() {
                console.log('data.str被修改成了', this.str);
            }
        }
    })
    window.vue = vue;
   
   当通过控制台修改this.str = 'hahaha';能够触发watch函数console.log('data.str被修改成了', this.str);
