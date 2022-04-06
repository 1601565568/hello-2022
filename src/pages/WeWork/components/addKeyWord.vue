<!--
 * @Date: 2022-03-30 14:04:18
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-06 19:21:51
 * @FilePath: \ECRP-SG-WEB\src\pages\WeWork\components\addKeyWord.vue
-->
<template>
  <el-dialog :visible.sync="visible" width="35%">
    <!-- <div style="height: 250px;padding-right:10px"> -->
    <template slot="title">
      <div class="dialog-title">新建关键词</div>
    </template>
    <div class="dialog-content">
      <el-form
        :model="Form"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        label-position="left"
        class="demo-ruleForm"
      >
        <el-form-item label="话题名称：" prop="topicType">
          <div class="topic-title">
            <span>请选择话题</span>
            <span class="title-blue">新建话题</span>
          </div>
          <el-select
            v-model="Form.topicType"
            placeholder="请选择话题名称"
            style="width: 100%"
          >
            <el-option
              v-for="item in options"
              :key="item.topicId"
              :label="item.topicName"
              :value="item.topicId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词：" prop="keyWords">
          <div class="topic-title">
            多关键字用","隔开，且每个关键词不得超过10个字符，如关键词1,关键词2
          </div>
          <el-input
            type="textarea"
            v-model="Form.keyWords"
            :rows="10"
            placeholder="请输入关键词"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <span class="text-primary">
            <i>
              <Icon type="exclamation-circle" />
            </i>
            <span
              >多关键字用","隔开，且每个关键词不得超过10个字符，如关键词1,关键词2</span
            >
          </span>
        </el-form-item> -->
      </el-form>
    </div>

    <!-- </div> -->
    <span slot="footer" class="dialog-footer">
      <ns-button @click="onCancel">取 消</ns-button>
      <ns-button type="primary" @click="confirm()">确 定</ns-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      Form: {
        keyWords: '',
        topicType: ''
      },
      rules: {
        keyWords: [
          { required: true, message: '请输入关键词', trigger: 'blur' }
        ],
        topicType: [{ required: true, message: '请选择' }]
      },
      visible: false,
      listParams: {
        start: 0,
        time: '',
        length: 100,
        name: ''
      },
      options: []
    }
  },
  mounted () {
    this.fetchOptions()
  },
  methods: {
    onShow () {
      this.visible = true
    },
    onCancel () {
      this.$refs.ruleForm.resetFields()
      this.visible = false
    },
    confirm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let newKeyWord = ''
          while (this.Form.keyWords.indexOf('，') !== -1) {
            newKeyWord = this.Form.keyWords.replace('，', ',')
            this.Form.keyWords = newKeyWord
          }
          if (this.Form.keyWords.endsWith(',')) {
            this.$notify.error('请去掉关键词结尾的 , ')
            return false
          }
          const addWords = JSON.parse(JSON.stringify(this.Form.keyWords))
          const arr = addWords.split(',')
          const checkee = arr.every(item => {
            return item.length <= 10 && item.length > 0
          })
          if (checkee) {
            this.$emit('add', {
              keyWords: addWords,
              topicId: this.Form.topicType
            })
            this.$refs.ruleForm.resetFields()
            this.visible = false
          } else {
            this.$notify.error('每个关键词不得超过10个字符')
          }
        } else {
          this.$notify.error('请填写关键词！')
          return false
        }
      })
      //   this.$refs[ruleForm].resetFields()
    },
    fetchOptions () {
      if (this.options.length > 0) return
      this.$http
        .fetch(
          this.$api.weWork.topicAnalysis.getKeyWordTopicList,
          this.listParams
        )
        .then(res => {
          this.options = res.result || []
        })
        .catch(error => {
          this.$notify.error(error.msg)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-title {
  height: 24px;
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #303133;
  line-height: 24px;
  font-weight: bold;
}
.dialog-content {
  margin:37px 10px;
  .topic-title {
    font-size: 12px;
    color: #595959;
    line-height: 20px;
    font-weight: 400;
    .title-blue {
      margin-left: 4px;
      color: #0094fc;
    }
  }
}
</style>
