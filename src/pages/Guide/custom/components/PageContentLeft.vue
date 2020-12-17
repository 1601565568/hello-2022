<template>
  <div class="PageContentMiddle">
    <el-collapse class="common-collapse" v-model="activeNames">
      <el-collapse-item
        v-for="item in menuArr"
        :key="item.projectType"
        :name="item.projectType"
      >
        <template slot="title">
          {{ item.projectTypeName }}
        </template>
        <p
          class="collapse-content"
          :class="
            defaultActive === `${item.projectType}-${itemChildren.moduleType}`
              ? 'lightHeight'
              : ''
          "
          v-for="itemChildren in item.menuList"
          @click="
            onClick(
              item.projectType,
              itemChildren.moduleType,
              itemChildren.moduleName
            )
          "
          :key="itemChildren.moduleType"
        >
          {{ itemChildren.moduleName }}
        </p>
      </el-collapse-item>
    </el-collapse>
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
