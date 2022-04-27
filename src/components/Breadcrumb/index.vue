<!--
 * @Date: 2022-04-14 11:23:58
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-14 17:36:24
 * @FilePath: \ECRP-SG-WEB\src\components\Breadcrumb\index.vue
-->
<template>
  <ElBreadcrumb class="breadcrumb-container" v-bind="$attrs">
    <ElBreadcrumbItem v-for="item in levelList" :key="item.path">
      <a @click.prevent="handleLink(item.path)">
        <amf-remix-icon
          v-if="item.meta && item.meta.remixIcon"
          :icon-class="item.meta.remixIcon"
        ></amf-remix-icon>
        {{ item.meta.title || item.name }}
      </a>
    </ElBreadcrumbItem>
  </ElBreadcrumb>
</template>

<script>
// import { translateTitle } from '@/utils/i18n'
import ElBreadcrumb from '@nascent/nui/lib/breadcrumb'
import ElBreadcrumbItem from '@nascent/nui/lib/breadcrumb-item'
import { mapState } from 'vuex'

export default {
  name: 'Breadcrumb',
  components: { ElBreadcrumb, ElBreadcrumbItem },
  data () {
    return {
      levelList: this.getBreadcrumb()
    }
  },
  computed: mapState({
    menus: state => state.user.menus
  }),
  watch: {
    $route () {
      this.levelList = this.getBreadcrumb()
    }
  },
  methods: {
    // translateTitle,
    getBreadcrumb () {
      // console.log(this.$route.matched, 'route-----')
      // todo  [{name: 1}, {name:2}, {name:3}]
      // [{},{}]
      let menuItem = this.menus
      return this.$route.matched.map((item, index) => {
        // if (item.name === this.menus.) {
        // }
        // return {
        //   ...item,
        //   meta: {
        //     title: menuItem.title,
        //     icon: menuItem.icon,
        //     name: menuItem.name
        //   }
        // }
        tree()
      })
      function tree (itemData) {
        let res = {}
        itemData.map(() => {})
        return res
      }
    },
    handleLink (redirect) {
      this.$router.push(redirect)
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb-container {
  // height: $base-nav-bar-height;
  // font-size: $base-font-size-default;
  // line-height: $base-nav-bar-height;

  ::v-deep {
    .el-breadcrumb__item {
      .el-breadcrumb__inner {
        a {
          display: flex;
          float: left;
          font-weight: normal;
          color: #515a6e;

          i {
            margin-right: 3px;
          }
        }
      }

      &:last-child {
        .el-breadcrumb__inner {
          a {
            color: #999;
          }
        }
      }
    }
  }
}
</style>
