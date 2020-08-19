
<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :before-close="hide"
    :append-to-body="appendToBody"
    customClass="labeladd-dialog"
  >
    <div class="labeladd-dialog__wrapper">
      <el-form ref="form" @submit.native.prevent :rules="rules" :model="model">
        <el-form-item label-width="72px" label="标签名称：" prop="name">
          <el-input
            v-model="model.name"
            placeholder='请输入标签名称，长度在4-20个字符以内'
            :input="model.name=model.name.replace(/\s+/g,'')"
            @keyup.enter.native="handleSave"
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
  data () {
    return {
      title: '新增素材标签',
      model: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在4-20个字符以内', trigger: 'blur' }
        ]
      },
      data: null,
      loading: false,
      visible: false
    }
  },
  created: function () {},
  methods: {
    show (data) {
      this.loading = false
      this.visible = true
      this.title = data ? '编辑素材标签' : '新增素材标签'
      this.model.name = data ? data.subdivisionName : ''
      this.data = data ? { id: data.subdivisionId, name: data.subdivisionName, sort: data.sort } : null
    },
    hide () {
      this.visible = false
      this.$refs.form.resetFields()
    },
    // 提交保存
    handleSave () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.doSave()
        }
      })
    },
    async doSave () {
      this.loading = true
      const params = { ...this.data, ...this.model }
      this.$http.fetch(this.$api.guide.materialGroudDeit, params).then(resp => {
        this.$notify.success(`${this.title}成功`)
        this.$emit('submit')
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
>>> .labeladd-dialog {
  width: 400px;
}
>>> .labeladd-dialog__wrapper {
  margin-top: 10px;
  padding: 0 0 30px;
}
</style>
