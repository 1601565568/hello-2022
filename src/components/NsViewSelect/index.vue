<template>
  <div class="view-select">
    <span class="label-title" v-if="showTitle">视角：</span>
    <el-select
      v-bind="$attrs"
      v-on="$listeners"
      placeholder="请选择"
      :value="value"
      @change="change"
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
 * 视角切换全局缓存
 */
export default {
  inheritAttrs: false,
  props: {
    value: [ String, undefined ],
    showTitle: { type: Boolean, default: true }
  },
  data () {
    return {
      viewList: []
    }
  },
  computed: {
    /**
     * 视角id
     */
    areaId () {
      window.console.log('areaId', this.$store.state.user.area.id)
      return this.$store.state.user.area.id
    },
    /**
     * 视角范围 1-不同品牌不同视角，2-不同区域不同视角
     */
    viewRange () {
      return this.$store.state.user.remumber.remumber_login_info.productConfig.viewRange
    },
    viewId () {
      return this.$store.state.user.remumber.remumber_login_info.productConfig.viewId
    }
  },
  watch: {
    '$store.state.user.area' (newVal, oldVal) {
      // 请求接口，获取当前区域id下的视角
      window.console.log('区域切换了', newVal, oldVal)
    }
  },
  created () {
    this.setViewList()
  },
  methods: {
    /**
     * 设置组件渲染的视角列表
     */
    setViewList () {
      window.console.log('切换视角')
      if (this.viewRange === 1) {
        // 按品牌
        this.viewList = this.$store.state.user.views
        if (this.viewList.length) {
          if (!this.viewId) {
            this.change(this.viewList[0].viewId)
          }
          this.$emit('update:initViewId', this.viewList[0].viewId)
        }
      } else if (this.viewRange === 2) {
        // 按区域
        // this.viewList = this.$store.state.user.views
        // 根据区域id去请求接口 areaId
        this.$http.fetch(this.$api.core.common.findViewListByAreaId, { areaId: this.areaId })
          .then(res => {
            window.console.log(res)
            if (res.success) {
              this.viewList = res.result
              if (this.viewList.length) {
                if (!this.viewId) {
                  this.change(this.viewList[0].viewId)
                }
                this.$emit('update:initViewId', this.viewList[0].viewId)
              }
            } else {
              this.$notify.error(res.msg)
            }
          }).catch(res => {
            this.$notify.error('视角列表查询失败')
          })
      }
    },
    /**
     * 切换视角时，记录切换的视角id到store中
     */
    change (veiwId) {
      // 设置视角id
      // this.$store.commit('user/UPDATE_REMUMBER', { ...this.$store.state.user.remumber, hello: 'world' })
      this.$store.commit('user/UPDATE_REMUMBER', {
        ...this.$store.state.user.remumber,
        remumber_login_info: {
          ...this.$store.state.user.remumber.remumber_login_info,
          productConfig: {
            ...this.$store.state.user.remumber.remumber_login_info.productConfig,
            viewId: veiwId
          }
        }
      })
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
