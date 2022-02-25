<!--<iframe id='linkedFrame' hight='auto' width='100%' src='http://localhost:8025/v3/friendsDrainage/demo/' frameborder='0' scrolling='auto' onload='this.height=1000'></iframe>-->
<template>
  <div>
    <!-- Vue的router-view -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- iframe页 -->
    <component
      v-for="item in hasOpenComponentsArr"
      :key="item.name"
      :is="item.name"
      v-show="$route.path === item.path"
    ></component>
  </div>
</template>

<script>
import Vue from 'vue/dist/vue.js'
// <component
//   v-for="item in hasOpenComponentsArr"
//   :key="item.name"
//   :is="item.name"
//   v-show="$route.path === item.path"
// ></component>
// @nascent/ecrp-ecrm/src/App.vue
// <iframe id='linkedFrame' v-show="$route.path === '/Social/SocialOperation/RedPacket/Send/List'" hight='auto' width='100%' src='http://localhost:8025/v3/friendsDrainage/demo/' frameborder='0' scrolling='auto' onload='this.height=1000'></iframe>

export default {
  created () {
    // 设置iframe页的数组对象
    const componentsArr = this.getComponentsArr()
    componentsArr.forEach(item => {
      Vue.component(item.name, item.component)
    })
    this.componentsArr = componentsArr
    // 判断当前路由是否iframe页
    this.isOpenIframePage()
  },
  data () {
    return {
      componentsArr: []
    }
  },
  watch: {
    $route () {
      // 判断当前路由是否iframe页
      this.isOpenIframePage()
    }
  },
  computed: {
    // 实现懒加载，只渲染已经打开过（hasOpen:true）的iframe页
    hasOpenComponentsArr () {
      return this.componentsArr.filter(item => item.hasOpen)
    }
  },
  methods: {
    // 根据当前路由设置hasOpen
    isOpenIframePage () {
      const target = this.componentsArr.find(item => {
        return item.path === this.$route.path
      })
      if (target && !target.hasOpen) {
        target.hasOpen = true
      }
    },
    // 遍历路由的所有页面，把含有iframeComponent标识的收集起来
    getComponentsArr () {
      const router = this.$router
      const routes = router.options.routes[6].children[1].children[2].children
      let iframeArr = routes.filter(item => item.iframeComponent)
      return iframeArr.map(item => {
        return {
          name: item.name,
          path: item.path,
          hasOpen: true, // 是否打开过，默认false
          component: item.iframeComponent // 组件文件的引用
        }
      })
    }
  }
}
</script>
