<template>
  <el-dialog :visible.sync="visible" width="35%" append-to-body>
    <!-- <div style="height: 250px;padding-right:10px"> -->
    <template slot="title">
      <div class="dialog-title">新建话题</div>
    </template>
    <el-form
      :model="Form"
      :rules="rules"
      ref="topicRuleForm"
      label-width="110px"
      label-position="left"
      class="demo-ruleForm"
    >
      <el-form-item label="话题名称" prop="topicName">
        <el-input
          type="text"
          v-model="Form.topicName"
          maxlength="20"
          show-word-limit
          placeholder="请输入话题名称"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="关键词：" prop="keyWords">
        <el-input type="textarea" v-model="Form.keyWords" :rows="10"></el-input>
      </el-form-item>
      <el-form-item>
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
        topicName: ''
        // keyWords: ''
      },
      rules: {
        topicName: [
          { required: true, message: '请输入话题名称', trigger: 'blur' }
        ]
      },
      visible: false
    }
  },
  methods: {
    onShow () {
      this.visible = true
    },
    onCancel () {
      this.$refs.topicRuleForm.resetFields()
      this.visible = false
    },
    confirm () {
      this.$refs.topicRuleForm.validate(valid => {
        if (valid) {
          // let newKeyWord = ''
          // while (this.Form.keyWords.indexOf('，') !== -1) {
          //   newKeyWord = this.Form.keyWords.replace('，', ',')
          //   this.Form.keyWords = newKeyWord
          // }
          // if (this.Form.keyWords.endsWith(',')) {
          //   this.$notify.error('请去掉结尾的 , ')
          //   return false
          // }
          // const addWords = JSON.parse(JSON.stringify(this.Form.keyWords))
          // if (addWords) {
          //   const arr = addWords.split(',')
          //   const checkee = arr.every(item => {
          //     return item.length <= 10 && item.length > 0
          //   })
          //   if (!checkee) {
          //     this.$notify.error('每个关键词不得超过10个字符')
          //     return false
          //   }
          // }
          this.$emit('add', JSON.parse(JSON.stringify(this.Form)))
          this.$refs.topicRuleForm.resetFields()
          this.visible = false
        }
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
.demo-ruleForm {
  >>> .el-form-item--small.el-form-item {
    margin: 16px 0 24px;
  }
}
</style>
