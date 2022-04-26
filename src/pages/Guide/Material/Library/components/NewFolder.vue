<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="758px"
    :before-close="hide"
    :close-on-click-modal="false"
    :append-to-body="appendToBody"
    customClass="folder-dialog"
  >
    <div class="folder-dialog__wrapper">
      <el-form ref="form" @submit.native.prevent :rules="rules" label-width="105px" :model="model">
        <el-form-item label='文件夹名称：' prop="name">
           <el-input
              type="textarea"
              v-model="model.name"
              placeholder="请输入文件夹名称，长度在150个字符以内"
              maxlength="150"
              show-word-limit
              class="folder-dialog__textarea"
              :input="model.name=model.name.replace(/\s+/g,'')"
              clearable
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
import { getErrorMsg } from '@/utils/toast'
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
      model: { name: '' },
      parent: null,
      rules: {
        name: [
          { required: true, message: '请输入文件夹名称', trigger: ['blur', 'change'] },
          { min: 0, max: 150, message: '限制长度在150个字符以内', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {},
  methods: {
    show (params = {}) {
      this.visible = true
      this.title = params.type === 'edit' ? '编辑文件夹' : '新建文件夹'
      this.parent = params.parent || { id: 0 }
      this.model = { name: '', ...params.model }
    },
    hide () {
      this.visible = false
      this.$refs.form.resetFields()
    },
    handleSave () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.doSave()
        } else {
          this.$notify.error('请填写文件夹名称')
        }
      })
    },
    async doSave () {
      this.loading = true
      this.$http.fetch(this.$api.guide.saveOrUpdateDirectory, {
        isDirectory: 1,
        parentId: this.parent.id,
        ...this.model
      }).then(resp => {
        this.$notify.success(`${this.title}成功`)
        this.$emit('submit', this.parent)
        this.hide()
      }).catch(resp => {
        this.$notify.error(getErrorMsg(this.title, resp))
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style scoped>
>>> .folder-dialog {
  width: 400px;
}
>>> .folder-dialog__wrapper {
  margin-top: 10px;
}
.folder-dialog__textarea >>> textarea {
  min-height: 144px!important;
}
</style>
