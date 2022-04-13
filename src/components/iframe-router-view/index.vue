<!--<iframe id='linkedFrame' hight='auto' width='100%' src='http://localhost:8025/v3/friendsDrainage/demo/' frameborder='0' scrolling='auto' onload='this.height=1000'></iframe>-->
<template>
  <div>
    <!-- Vue的router-view -->
    <!-- <keep-alive> -->
      <router-view></router-view>
    <!-- </keep-alive> -->
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
      const yiz = ['聚合码', '欢迎语']
      const router = this.$router
      // 找到下标
      const routerList = router.options.routes
      // 夫下标
      const index = routerList.findIndex(item => item.meta.title === '获客引流')
      // 设置左侧菜单的list
      const leftList = routerList[index].children
      // 左侧菜单下标
      const zIndex = leftList.findIndex(item => item.title === '好友引流')
      // 获取内容的list
      const list = leftList[zIndex].children
      // 获取符合要求的list
      const AryList = list.filter(item => yiz.includes(item.title))
      const arr = []
      AryList.forEach(item => arr.push(item.children))
      let iframeArr = arr.flat().filter(item => item.iframeComponent)
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
