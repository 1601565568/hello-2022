<template>
  <div class="PageContentMiddle">
    <el-collapse class="common-collapse" v-model="activeNames">
      <el-collapse-item v-for="item in menu" :key="item.id" :name="item.id">
        <template slot="title">
          {{ item.menuTitle }}
        </template>
        <p
          class="collapse-content"
          :class="
            defaultActive === `${item.id}-${itemChildren.id}`
              ? 'lightHeight'
              : ''
          "
          v-for="itemChildren in item.meunList"
          @click="onClick(item.id, itemChildren.id, itemChildren.menuListTitle)"
          :key="itemChildren.id"
        >
          {{ itemChildren.menuListTitle }}
        </p>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  data () {
    let menuBar = [
      {
        menuTitle: '导购小程序',
        id: 1,
        meunList: [
          {
            menuListTitle: '工作台',
            show: true,
            id: 1
          },
          {
            menuListTitle: '业绩',
            show: false,
            id: 2
          },
          {
            menuListTitle: '我的',
            show: false,
            id: 3
          }
        ]
      },
      {
        menuTitle: '店长小程序',
        id: 2,
        meunList: [
          {
            menuListTitle: '业绩',
            show: false,
            id: 1
          },
          {
            menuListTitle: '管理',
            show: false,
            id: 2
          }
        ]
      }
    ]
    return {
      menu: menuBar,
      activeNames: [1, 2],
      defaultActive: '1-1'
    }
  },
  methods: {
    onClick (menuId, menuChildrenId, menuListTitle) {
      let active = `${menuId}-${menuChildrenId}`
      if (active !== this.defaultActive) {
        this.defaultActive = active
        this.$emit('onChange', menuId, menuListTitle)
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import './style/PageContentLeft.css';
.PageContentMiddle {
  padding: 0 6px;
}
.collapse-content {
  cursor: default;
  padding: 0 10px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: #595959;
  &:hover {
    background: #f5f5f5;
  }
}
.lightHeight {
  background: #f5f5f5;
  border-radius: 2px;
  color: #262626;
}
</style>
