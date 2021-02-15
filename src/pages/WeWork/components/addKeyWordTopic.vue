<template>
  <el-dialog title="添加话题" :visible.sync="visible" width="35%">
    <!-- <div style="height: 250px;padding-right:10px"> -->
    <el-form
      :model="Form"
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      class="demo-ruleForm"
    >
      <el-form-item label="话题名称：" prop="topicName">
        <el-input
          type="text"
          v-model="Form.topicName"
          maxlength="20"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="关键词：">
        <el-input type="textarea" v-model="Form.keyWords" :rows="10"></el-input>
      </el-form-item>
      <el-form-item>
        <span class="text-primary">
          <i>
            <Icon type="exclamation-circle" />
          </i>
          <span
            >多关键字用“，”隔开，且每个关键词不得超过10个字符，如关键词1，关键词2</span
          >
        </span>
      </el-form-item>
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
        topicName: '',
        keyWords: ''
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
      this.$refs.ruleForm.resetFields()
      this.visible = false
    },
    confirm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const addWords = JSON.parse(JSON.stringify(this.Form.keyWords))
          if (addWords) {
            const arr = addWords.split(',')
            const checkee = arr.every(item => {
              return item.length <= 10 && item.length > 0
            })
            if (!checkee) {
              this.$notify.error('添加关键词格式错误')
              return false
            }
          }
          this.$emit('add', JSON.parse(JSON.stringify(this.Form)))
          this.$refs.ruleForm.resetFields()
          this.visible = false
        }
      })
      //   this.$refs[ruleForm].resetFields()
    }
  }
}
</script>
