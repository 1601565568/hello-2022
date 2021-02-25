<template>
  <span>
    <slot name="content" :exhibitionData="exhibitionData" :showData="showData">
      <el-tooltip placement="top" effect="light" :content="exhibitionData" v-if="tooltipVisible(exhibitionData)">
        <span>
        {{showData(exhibitionData)}}
        </span>
      </el-tooltip>
      <span v-if="!tooltipVisible(exhibitionData)">{{showData(exhibitionData)}}</span>
    </slot>
    <span @click="clickData()" v-if="visible">
      <Icon type="ns-preview" class="cursor-pointer font-size-base eye" v-if="visibleData" />
      <Icon type="ns-eye-close" class="cursor-pointer font-size-base eye" v-else />
    </span>
  </span>
</template>

<script>
import { uuid } from '../../utils/uuid'

/**
   * 数据类型 父组件需引用此数组
   * @type {{PHONE: string, SIMPLE: string}}
   */
export const typeArray = {
  PHONE: 'phone',
  SIMPLE: 'simple'
}
export default {
  name: 'NsSgSensitiveButton',
  props: {
    //
    sensitiveData: {
      type: String,
      default () {
        return ''
      }
    },
    //
    encryptData: {
      type: String,
      default () {
        return ''
      }
    },
    // 数据类型 由父组件传入
    type: {
      type: String,
      default () {
        return ''
      }
    },
    // 空值默认展示数据 由父组件传入 (true: '-'; false: '')
    defaultText: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 数据展示长度 由父组件传入
    textLength: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  data () {
    return {
      // 用户可见权限
      visible: false,
      // 当前处理状态
      visibleData: false,
      // 解密缓存数据
      decryptCacheData: '',
      // 展示数据
      exhibitionData: '',
      // 当前组件唯一标识
      uniqueKey: ''
    }
  },
  watch: {
    '$store.state.common.sensitiveCount' (value) {
      if (this.visibleData && value !== this.uniqueKey) {
        this.restoreData()
      }
    },
    encryptData (value) {
      if (value === null || value === '') {
        this.visibleData = false
      }
      this.checkVisible()
      this.decryptCacheData = ''
    },
    sensitiveData (value) {
      if (value === null || value === '') {
        this.visibleData = false
      }
      this.exhibitionData = this.sensitiveData
    }
  },
  mounted () {
    // 唯一标识赋值
    this.uniqueKey = uuid()
    this.exhibitionData = this.sensitiveData
    this.checkVisible()
    this.decryptCacheData = ''
  },
  methods: {
    /**
       * 图标点击事件
       */
    clickData () {
      if (this.encryptData.length > 0 && this.type.length > 0) {
        if (this.visibleData) {
          // 脱敏处理
          this.exhibitionData = this.sensitiveData
          this.visibleData = false
        } else {
          // 赋值触发监听事件
          let variable = JSON.parse(JSON.stringify(this.$store.state.common.sensitiveCount))
          variable = this.uniqueKey
          this.$store.dispatch('common/setSensitiveCount', variable)
          this.getPlainText()
        }
      }
    },
    /**
       * 获取解密数据
       */
    getPlainText () {
      if (this.decryptCacheData.length > 0) {
        this.exhibitionData = this.decryptCacheData
        this.visibleData = true
      } else {
        this.$http.fetch(this.$api.core.common.getDecryptData, { encryptData: this.encryptData, type: this.type }).then((resp) => {
          if (!resp.success) {
            this.$notify.warning(resp.msg)
          } else {
            this.exhibitionData = resp.result
            // 缓存赋值
            this.decryptCacheData = resp.result
            this.visibleData = true
          }
        }).catch(() => {
        })
      }
    },
    /**
       * 敏感信息可见属性 (用户可见权限;公司级敏感信息查看权限;密文数据)
       */
    checkVisible () {
      if (this.$store.state.user.remumber.remumber_login_info.dataAuth.viewSensitiveData &&
              this.$store.state.user.remumber.remumber_login_info.uiLockBtnEnable === 1 &&
              this.encryptData && this.encryptData.length > 0) {
        this.visible = true
      } else {
        this.visible = false
      }
    },
    /**
       * 数据展示
       */
    showData (value) {
      if (!value || value.length <= 0) {
        if (this.defaultText) {
          return '-'
        } else {
          return ''
        }
      } else {
        if (this.textLength !== 0 && value.length > this.textLength) {
          return value.substr(0, this.textLength) + '...'
        } else {
          return value
        }
      }
    },
    /**
       * 悬浮可见属性
       */
    tooltipVisible (value) {
      if (this.textLength !== 0 && value !== null && value.length > this.textLength) {
        return true
      }
      return false
    },
    /**
     * 数据还原
     */
    restoreData () {
      this.exhibitionData = this.sensitiveData
      this.visibleData = false
    }
  }
}
</script>

<style scoped>
  @import "@theme/variables.pcss";
  .eye {
    position: relative;
    top: 1px;
    margin-left: 2px;
  }
</style>
