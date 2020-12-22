<template>
  <div class="PageContentMiddle">
    <div
      class="PageContentMiddle-menu__title"
      v-for="item in menuArr"
      :key="item.projectType"
    >
      <h3>{{ item.projectTypeName }}</h3>
      <div
        class="PageContentMiddle-menu"
        :class="
          defaultActive === `${item.projectType}-${itemChildren.moduleType}`
            ? 'lightHeight'
            : ''
        "
        v-for="itemChildren in item.menuList"
        :key="itemChildren.moduleType"
        @click="
          onClick(
            item.projectType,
            itemChildren.moduleType,
            itemChildren.moduleName
          )
        "
      >
        {{ itemChildren.moduleName }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    menuArr: {
      type: Array,
      default: () => {
        return []
      }
    },
    defaultActive: {
      type: String
    }
  },
  data () {
    return {
      activeNames: [1, 2]
    }
  },
  methods: {
    onClick (menuId, menuChildrenId, menuListTitle) {
      let active = `${menuId}-${menuChildrenId}`
      if (active !== this.defaultActive) {
        this.$emit('onChange', {
          menuId,
          menuListTitle,
          active,
          moduleType: menuChildrenId
        })
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.PageContentMiddle {
  padding: 0 6px;
}
.lightHeight {
  background: #f5f5f5;
  border-radius: 2px;
  color: #262626;
}
.PageContentMiddle-menu__title {
  width: 100%;
  h3 {
    padding: 0 10px;
    line-height: 48px;
    height: 48px;
    font-size: 14px;
    color: #303133;
    font-weight: bold;
  }
}
.PageContentMiddle-menu {
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
</style>
