<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="hide"
    :close-on-click-modal=false
    :append-to-body="appendToBody"
    customClass="folder-dialog"
  >
    <div class="folder-dialog__wrapper">
      <el-form ref="form" :inline="true" :rules="rules" label-width="84px" :model="model">
        <el-form-item label='文件夹名称：' prop="folderName">
           <el-input
              v-model="model.folderName"
              placeholder="限制长度4-10个字符"
              style="width: 256px"
            ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <ns-button @click="hide">取 消</ns-button>
      <ns-button type="primary" :loading="loading" @click="handleSave">确 定</ns-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    appendToBody: {
      type: Boolean,
      default: function () {
        return true
      }
    }
  },
  data: function () {
    return {
      title: '新建文件夹',
      visible: false,
      loading: false,
      model: {
        folderId: null,
        folderName: ''
      },
      rules: {
        folderName: [
          { required: true, message: '请输入文件夹名称' },
          { min: 4, max: 10, message: '长度在 4 到 10 个字符' }
        ]
      }
    }
  },
  computed: {},
  methods: {
    show (params = {}) {
      this.visible = true
      this.title = params.type === 'edit' ? '编辑文件夹' : '新建文件夹'
      this.model = { ...params.model }
    },
    hide () {
      this.visible = false
      this.$refs.form.resetFields()
    },
    handleSave () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('refresh')
          this.hide()
          // console.log(this.model)
        }
      })
    }
  }
}
</script>
<style scoped>
>>> .folder-dialog {
  width: 400px;
  .el-dialog__header {
    padding: 20px 30px !important;
  }
  .el-dialog__headerbtn {
    top: 20px !important;
    right: 30px !important;
  }
  .el-dialog__body {
    padding: 0 30px !important;
  }
  .el-dialog__footer {
    padding: 10px 30px 20px !important;
  }
}
>>> .folder-dialog__wrapper {
  margin-top: 10px;
  padding-bottom: 40px;
}
</style>
