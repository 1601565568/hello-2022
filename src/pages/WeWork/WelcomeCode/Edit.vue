<!--
 * @Descripttion: 编辑智能欢迎语
 * @Author: yuye.huang
 * @Date: 2020-03-01 19:58:47
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-03-01 21:36:56
 -->
<template>
  <div style="background-color: white">
    <el-scrollbar ref="integralRuleHeight" outsider>
      <el-form ref='form' :model="model" label-width="150px">
        <div class="form-grid">
          <div class="form-grid__title">
            <div class="bluepillar"></div>
            {{ title }}
          </div>
          <div class="form-grid__content">
            <el-form-item label="智能欢迎语：" size="xxs"
            prop='content' :rules="commonRules.content">
              <el-form-grid>
                <el-input type='textarea'
                  autofocus="true"
                  v-model="model.content"
                  placeholder="设置欢迎语内容，最多100字"
                  clearable
                ></el-input>
              </el-form-grid>
            </el-form-item>
            <el-form-item>
              <ns-button type="primary" @click="onSave">保存</ns-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-scrollbar>
  </div>
</template>

<script>
import commonRules from './src/commonRules.js'

export default {
  name: '',
  data: function () {
    return {
      commonRules: commonRules,
      model: {
        content: ''
      },
      title: '新增智能欢迎语'
    }
  },
  mounted: function () {
    this.$init({ uuid: this.$route.query.uuid })
  },
  methods: {
    onSave: function () {
      let that = this
      let param = {
        content: that.model.content
      }
      that.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        that.$http
          .fetch(that.$api.weWork.welcomeCode.saveWelcomeCode, param)
          .then(resp => {
            // 1、先触发表格数据更新
            // this.$emit('change')
            // 2、关闭弹框
            // that.onCloseDialog()
            // 3、提示
            that.$notify.success('新增成功')
            that.$router.push({ path: '/WeWork/WelcomeCode/WelcomeList' })
          })
          .catch(resp => {
            that.$notify.error(resp.msg)
          })
          .finally(() => { })
      })
    },
    /**
     * @msg: 页面初始化时的数据加载函数
     */
    $init (data) {
      // 页面初始化时，加载页面数据
      let that = this
      if (data.uuid) {
        that.$http
          .fetch(that.$api.weWork.welcomeCode.getWelcomeCode, {
            uuid: data.uuid
          })
          .then(resp => {
            that.model = resp.result
          })
      }
    }
  }
}
</script>
