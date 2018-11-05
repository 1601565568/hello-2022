<template>
  <div class="form-main">
    <el-scrollbar ref="demoListHeight">
      <el-menu
        :default-openeds="defaultOpeneds">
        <el-submenu :index="list.title" v-for="(list, index) in listData.children" :key="index">
          <template slot="title">
            <span>{{list.title}}</span>
          </template>
          <el-menu-item
            v-for="(item, itemIndex) in list.children" :key="itemIndex" :index="item.path">
            <router-link class="list-area" :to="{ name: item.name}">{{item.title}}</router-link>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
  import MenuDev from 'configs/menu.dev.json'
  export default {
    name: 'DemoList',
    data () {
      return {
        listData: MenuDev,
        defaultOpeneds: ['页面Demo']
      }
    },
    created () {
    },
    mounted () {
      this.$nextTick(() => {
        let limitHeight = window.innerHeight - 65
        this.$refs.demoListHeight.$el.children[0].style.maxHeight = limitHeight + 'px'
      })
    },
    computed: {
    },
    methods: {
    }
  }
</script>

<style scoped>
  >>> .el-menu {
    border: none;
    .el-submenu {
      .el-submenu__title {
        height: 34px;
        line-height: 34px;
      }
      .el-menu-item {
        height: 30px;
        line-height: 30px;
        a {
          display: block;
        }
      }
    }
  }
</style>
