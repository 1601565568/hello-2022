<template>
    <div class="directive-container">
        <!--
            注意：全局注册的指令，v-指令名称  或者 :指令名称='true' 都可以
        -->
        <!--<input class="global-directive" type="text" :autofocus="true" placeholder="这是全局注册的自动聚焦指令autofocus测试" />-->

        <!--
            注意：局部注册的组件，只能使用v-指令名称
        -->
        <input v-model="n" class="global-directive" type="text" v-focus placeholder="这是局部注册的自动聚焦指令focus测试"/>

        <p v-bind:id="n | money">测试全局指令`money` and 局部指令`capitalize` ：{{n | money | capitalize}}</p>
    </div>
</template>

<script>
import focus from '@/directives/modules/focus'

import capitalize from '@/filters/modules/capitalize'

export default {
  name: 'directive-test',
  directives: {
    focus
  },
  filters: {
    capitalize
  },
  data () {
    return {
      n: 'hello'
    }
  }
}
</script>
