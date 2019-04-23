<template>
  <div class="menu" id="left-menu">
    <div v-for="(route,index) in $store.state.operate.menus"
         :key='route.path'
         class="menu-sub">
      <el-scrollbar>
        <el-menu
          :default-active="$route.path"
          router
          :default-openeds="subMenuDefaultOpeneds"
          class="menu-sub__menu"
        >
          <template
            v-for="(item,index) in route.children">
            <!--无三级菜单-->
            <el-menu-item
              :index='item.path'
              v-if="item.children.length <1 "
              class="menu-sub__item">
              <span class="item-title">{{item.title}}</span>
            </el-menu-item>
            <!--有三级菜单-->
            <el-submenu
              :index="item.path"
              :key='item.path'
              v-if="item.children.length >0 ">
              <template slot="title">
                <span class="el-submenu__item">{{item.title}}</span>
              </template>
              <el-menu-item
                v-for='(child,index) in item.children'
                :key='child.path'
                v-if="!child.hidden"
                :index='child.path'>
                <span class="item-title">{{child.title}}</span>
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      win_size: {
        height: ''
      },
      subMenu: [],
      subMenuDefaultOpeneds: []
    }
  },
  watch: {
    $route () {
      this.setSubMenu()
    },
    subMenu: {
      handler (val) {
        this.scrollbarHeightFun()
      },
      immediate: true,
      deep: true
    }
  },
  mounted: function () {
    this.scrollbarHeightFun()
    window.addEventListener('resize', this.setSize)
  },
  methods: {
    scrollbarHeightFun () {
      this.$nextTick(() => {
        let limitHeight = window.innerHeight - 45
        let scrollbarContent = document.getElementById('left-menu').getElementsByClassName('el-scrollbar__wrap')
        if (scrollbarContent.length) {
          scrollbarContent[0].style.maxHeight = limitHeight + 'px'
        }
      })
    },
    setSize () {
      this.win_size.height = window.innerHeight + 'px'
    },
    setSubMenu (item) {
      if (item) {
        this.subMenu = item
      } else {
        this.$store.state.operate.menus.forEach((item) => {
          if (this.$route.matched[0].name === item.name) {
            this.subMenu = item
          }
        })
      }
    }
  },
  created () {
    this.setSubMenu()
    this.setSize()
    this.$store.state.operate.menus.forEach((item) => {
      item.children.forEach((v) => {
        this.subMenuDefaultOpeneds.push(v.path)
      })
    })
  }
}
</script>

<style scoped>
  @import "../../style/small/variables.pcss";
  .el-menu-item:hover, .el-menu-item:focus{
    background: transparent;
  }
  .el-menu {
    border-right: none;
    background-color: initial;
  }
  .is-selected-item{
    >>>.iconfont:before{
        color:var(--theme-color-primary);
      }
  }
  .menu-sub {
    border-right:1px solid #e2e2e2;
    >.el-menu {
      margin-top: var(--default-margin-larger);
      border-right: none;
      background-color: initial;
      color: #909399;
      >.el-submenu {
        margin-bottom: var(--default-padding-base);
        .el-menu-item {
          height: 30px;
        }
      }
      > .el-menu-item {
        margin-bottom: var(--default-padding-base);
      }
      .el-submenu__title {
        height: 30px;
      }
    }
  }
  .menu{height: 100%}
  @component-namespace menu {
    img {
      vertical-align: middle;
    }
  }
  @component-namespace menu {
    img {
      vertical-align: middle;
    }

    @b sub {
      position: fixed;
      top: 80px;
      left: 0;
      z-index: 1002;
      background-color: var(--default-menu-item-bg);
      width: var(--default-menu-second-width);
      height: 100%;
      @e title {
        text-align: center;
        font-weight: 400;
        font-style: normal;
        font-size: var(--default-font-size-middle);
        margin: 0;
        border-bottom: solid 1px rgba(255, 255, 255, .2);
        height: 60px;
        line-height: 60px;
        background-color: transparent;
      }
      @e menu {
        margin-top: var(--default-margin-base);
        padding-bottom: 25px;
      }
      @e item {
        &:before {
          content: '';
          display: initial;
          border-radius: 100%;
          width: 6px;
          height: 6px;
          background-color: rgb(204, 204, 204);
          position: absolute;
          top: 14px;
          left: 20px;
        }

        & > span {
          padding-left: 16px;
          font-size: var(--default-font-size-base);
        }
      }
      >>> .el-menu {
        background-color: var(--default-menu-item-bg);
      }

      >>> .el-menu-item {
        height: 35px;
        line-height: 30px;
        color: #909399;
      }

      >>> .el-submenu__title {
        height: 35px;
        line-height: 30px;
        background-color: initial !important;
        color: #909399;
        &:before {
          content: '';
          display: initial;
          border-radius: 100%;
          width: 6px;
          height: 6px;
          background-color: rgb(204, 204, 204);
          position: absolute;
          top: 14px;
          left: 20px;
        }
        & > span {
          padding-left: 16px;
        }
      }

      >>> .el-submenu__title:hover, .is-active, .el-menu-item:hover, .el-menu-item:hover {
        background-color: var(--default-menu-active-border);
      }
      >>>.is-active.el-menu-item{
        border-right:2px solid var(--head-nav-bg);
        .item-title{
          color: var(--head-nav-bg);
        }
      }
      >>>.is-active  .el-submenu__title{
        background: var(--default-menu-bg) !important;
        color: var(--theme-font-color-primary);
        i{
          color: var(--theme-font-color-primary);
        }
        &:before{
          background:var(--theme-font-color-primary);
        }
      }

      >>> .el-submenu .el-menu-item {
        min-width: 100%;
        padding: 0 0 0 45px!important;
        color: #909399;
        span {
          font-size: var(--default-font-size-small);
        }
      }

    }
    @media screen and (max-width: 1625px){
      @b sub{
        top: var(--head-nav-height-s);
      }
    }
  }
</style>
