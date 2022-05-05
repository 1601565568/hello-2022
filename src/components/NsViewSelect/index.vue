<template>
  <div class="view-select">
    <span class="label-title" v-if="showTitle">体系：</span>
    <el-select
      v-bind="$attrs"
      v-on="selectListeners"
      placeholder="请选择"
      :value="value"
      filterable
    >
      <el-option
        v-for="item in viewList"
        :key="item.viewId"
        :label="item.viewName"
        :value="item.viewId">
      </el-option>
    </el-select>
  </div>
</template>

<script>
/**
 * 体系切换全局缓存
 */
export default {
  inheritAttrs: false,
  props: {
    value: [ String, undefined ],
    showTitle: { type: Boolean, default: true },
    viewList: { type: Array }
  },
  data () {
    return {
      viewList2: []
    }
  },
  computed: {
    /**
     * 区域id
     */
    areaId () {
      return this.$store.state.user.area.id
    },
    /**
     * 体系范围 1-不同品牌不同体系，2-不同区域不同体系
     */
    viewRange () {
      return this.$store.state.user.remumber.remumber_login_info.productConfig.viewRange
    },
    viewId () {
      return this.$store.state.user.remumber.remumber_login_info.productConfig.viewId
    },
    viewIdKey () {
      const loginInfo = this.$store.state.user.remumber.remumber_login_info
      // 公司名-用户名
      return `${loginInfo.companyName}-${loginInfo.name}`
    },
    selectListeners () {
      const vm = this

      return {
        ...this.$listeners,
        change (value) {
          vm.setStore(value)
          vm.$emit('change', value)
        },
        input (value) {
          vm.setStore(value)
          vm.$emit('input', value)
        }
      }
    }
  },
  methods: {
    /**
     * 设置组件渲染的体系列表
     */
    setViewList () {
      if (this.viewRange === 1) {
        // 按品牌
        this.viewList = this.$store.state.user.views
        if (this.viewList.length) {
          let updateViewId = this.viewList[0].viewId
          if (!this.viewId) {
            const localViewId = localStorage.getItem(this.viewIdKey)
            if (localViewId) {
              let isEnableViewId = false
              for (const view of this.viewList) {
                if (view.viewId === localViewId) {
                  isEnableViewId = true
                  break
                }
              }

              if (isEnableViewId) {
                updateViewId = localViewId
              } else {
                localStorage.removeItem(this.viewIdKey)
              }
            }
          } else {
            updateViewId = this.viewId
          }

          this.selectListeners.input(localViewId)
        }
      } else if (this.viewRange === 2) {
        // 按区域 根据区域id去请求接口 areaId
        this.$http.fetch(this.$api.core.common.findViewListByAreaId, { areaId: this.areaId })
          .then(res => {
            if (res.success) {
              this.viewList = res.result
              if (this.viewList.length) {
                this.selectListeners.input(this.viewList[0].viewId)
              }
            } else {
              this.$notify.error(res.msg)
            }
          }).catch(res => {
            this.$notify.error('体系列表查询失败')
          })
      }
    },
    setStore (viewId) {
      this.$store.commit('user/UPDATE_REMUMBER', {
        ...this.$store.state.user.remumber,
        remumber_login_info: {
          ...this.$store.state.user.remumber.remumber_login_info,
          productConfig: {
            ...this.$store.state.user.remumber.remumber_login_info.productConfig,
            viewId: viewId
          }
        }
      })
      localStorage.setItem(this.viewIdKey, viewId)
    }
  }
}
</script>

<style lang="scss" scoped>
.view-select {
  font-size: 14px;
  color: #262626;
  line-height: 22px;
  font-weight: normal;
  .label-title {
    display: inline-block;
  }
}
</style>
