<template>
  <div class="menu">
    <el-scrollbar ref="leftMenuScrollbar">
      <template v-for="(route) in $store.state.operate.menus">
        <div class="menu-sub" :key='route.path' v-if='subMenu && subMenu.name===route.name'>
          <el-menu
            :default-active="subMenuDefaultActive"
            router
            :default-openeds="subMenuDefaultOpeneds"
            class="menu-sub__menu">
            <template
              v-for="(item, index) in route.children">
              <!--无三级菜单-->
              <el-menu-item :key="index"
                            :index='item.path'
                            v-if="item.children.length <1 "
                            class="menu-sub__item">
                                <span class="item-title"><i :class="'menu-icon--noChild'"><Icon :type="item.icon"/></i>{{item.title}}</span>
              </el-menu-item>
              <!--有三级菜单-->
              <el-submenu
                :index="item.path"
                :key='item.path'
                v-if="item.children.length >0 ">
                <template slot="title">
                  <span class="el-submenu__item"><i :class="'submenu__item-icon'"><Icon :type="item.icon"/></i>{{item.title}}</span>
                </template>
                <el-menu-item
                  v-for='(child) in item.children'
                  :key='child.path'
                  :index='child.path'>
                  <span class="item-title">{{child.title}}</span>
                </el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </div>
      </template>
    </el-scrollbar>
  </div>
</template>

<script>
import ElMenu from '@nascent/nui/lib/menu'
import ElMenuItem from '@nascent/nui/lib/menu-item'
import ElSubmenu from '@nascent/nui/lib/submenu'

export default {
  data () {
    return {
      subMenuDefaultActive: (this.$route.matched && this.$route.matched.length > 3) ? this.$route.matched[2].path : this.$route.path,
      subMenu: [],
      subMenuDefaultOpeneds: []
    }
  },
  components: {
    ElMenu,
    ElMenuItem,
    ElSubmenu
  },
  watch: {
    $route () {
      this.setSubMenu()
      this.subMenuDefaultActive = (this.$route.matched && this.$route.matched.length > 3) ? this.$route.matched[2].path : this.$route.path
    },
    '$store.state.operate.menus' () {
      this.setSubMenu()
    }
  },
  mounted: function () {
    this.setSubMenu()
    window.addEventListener('resize', this.scrollbarHeightFun)
  },
  methods: {
    scrollbarHeightFun () {
      this.$nextTick(() => {
        let limitHeight = window.innerHeight - 45
        let scrollbarContent = this.$refs.leftMenuScrollbar
        if (scrollbarContent) {
          scrollbarContent.$el.children[0].style.maxHeight = limitHeight + 'px'
        }
      })
    },
    setSubMenu (item) {
      // 设置子菜单数据
      if (item) {
        this.subMenu = item
      } else {
        this.$store.state.operate.menus.forEach((item) => {
          if (this.$route.matched[0].name === item.name) {
            this.subMenu = item
          }
        })
      }
      // 设置子菜单全部展开
      this.subMenu.children.forEach((item) => {
        item.children.forEach((v) => {
          this.subMenuDefaultOpeneds.push(v.path)
        })
      })
      // 更新菜单滚动条
      this.scrollbarHeightFun()
    }
  }
}
</script>

<style scoped>
  @import "@theme/variables.pcss";

  @component-namespace menu {
    /* 左侧菜单基础样式 */
    .menu {
      position: fixed;
      top: 80px;
      left: 0;
      z-index: 1002;
      border-right: 1px solid var(--theme-menu-border-color);
      background-color: var(--default-menu-item-bg);
      width: var(--default-menu-second-width);
      height: 100%;
    }

    @media screen and (max-width: 1625px) {
      .menu {
        top: var(--head-nav-height-s);
      }
    }
    /* 左侧主内容 */
    @b sub {
      height: 100%;
      @e menu {
        padding-bottom: 25px;
      }
      >>> .el-menu {
        color: var(--theme-font-color-secondary);
        background-color: var(--default-menu-item-bg);
        border-right: none;
        /* 无三级子菜单 */

        .el-menu-item {
          min-width: 100%;
          height: 45px;
          line-height: 45px;
          margin-bottom: var(--default-padding-base);
          color: var(--theme-font-color-secondary);
          padding: 0 26px !important;

          &.is-active {
            border-right: 2px solid var(--head-nav-bg);
            background-color: var(--default-menu-active-border);

            .item-title {
              color: var(--head-nav-bg);
              line-height: 45px;
            }
          }

          &:hover {
            background-color: var(--default-menu-active-border);
          }

          .menu-icon--noChild {
            font-size: 22px;

            &:before {
              position: relative;
              left: -5px;
              top: -1px;
            }
          }
        }

        /* 有三级子菜单 */

        .el-submenu {
          margin-bottom: var(--default-padding-base);

          &:first-child {
            margin-top: var(--default-margin-base);
          }

          .el-submenu__title {
            height: 45px;
            line-height: 45px;
            color: var(--theme-font-color-secondary);
            padding: 0 26px !important;

            .submenu__item-icon {
              padding-right: 10px;
              width: 25px;
              display: inline-block;
            }

            .el-submenu__item {
              .submenu__item-icon {
                font-size: 22px;

                &:before {
                  position: relative;
                  left: -5px;
                  top: -1px;
                }
              }
            }

            .el-submenu__icon-arrow {
              padding-right: 0 !important;
              width: auto !important;
              margin-top: -4px !important;
            }
          }

          &.is-active .el-submenu__title {
            background: var(--default-menu-bg) !important;
            color: var(--theme-font-color-primary);

            .submenu__item-icon {
              color: var(--theme-font-color-primary);
              padding-right: 10px;
            }
          }

          .el-menu-item {
            padding: 0 0 0 51px !important;
            height: 40px;
            line-height: 40px;

            .item-title {
              font-size: var(--default-font-size-small);
              line-height: 40px;
            }

            .submenu__item-icon {
              padding-right: 10px;
              width: 25px;
              display: inline-block;
            }
          }
        }
      }
    }
  }
</style>
