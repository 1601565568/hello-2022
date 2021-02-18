<template>
  <el-dialog title="添加敏感词" :visible.sync="visible" width="35%">
    <div style="height: 250px;padding-right:10px">
      <el-form
        :model="Form"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="敏感词：" prop="words">
          <el-input type="textarea" v-model="Form.words" :rows="10"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="text-primary">
            <i>
              <Icon type="exclamation-circle" />
            </i>
            <span
              >多敏感词用“,”隔开，且每个敏感词不得超过10个字符，如敏感词1,敏感词2</span
            >
          </span>
        </el-form-item>
      </el-form>
    </div>
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
        words: ''
      },
      rules: {
        words: [{ required: true, message: '请输入敏感词', trigger: 'blur' }]
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
          const addWords = JSON.parse(JSON.stringify(this.Form.words))
          const arr = addWords.split(',')
          const checkee = arr.every(item => {
            return item.length <= 10 && item.length > 0
          })
          if (checkee) {
            this.$emit('add', addWords)
            this.$refs.ruleForm.resetFields()
            this.visible = false
          } else {
            this.$notify.error('添加敏感词长度不能超过10个字符')
          }
        } else {
          this.$notify.error('请填写敏感词！')
          return false
        }
      })
      //   this.$refs[ruleForm].resetFields()
    }
  }
}
</script>
