<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="hide"
    :close-on-click-modal=false
    :append-to-body="appendToBody"
    customClass="labelmake-dialog"
  >
    <div class="labelmake-dialog__wrapper">
      <el-form ref="form" :rules="rules" label-width="72px" :model="model">
        <el-form-item label="选择标签：" prop="subdivisionId">
          <el-select
            v-model="model.subdivisionId"
            placeholder="请选择标签"
            filterable
            clearable
          >
            <el-option
              v-for="item in list"
              :key="item.subdivision_id"
              :label="item.subdivision_name"
              :value="item.subdivision_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <div>{{descStr}}</div>
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
      title: '标签管理',
      visible: false,
      loading: false,
      searchForm: {},
      list: []
    }
  },
  computed: {},
  methods: {
    show (selectRows = [], labelList = []) {
      this.visible = true
      this.selectRows = selectRows
      this.model = { subdivisionId: null }
      this.list = labelList
      if (!this.list.length) {
        this.loadList()
      }
    },
    hide () {
      this.visible = false
      this.$refs.form.resetFields()
    },
    loadList () {},
    handleSave () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('refresh')
          this.hide()
        }
      })
    }
  }
}
</script>
<style scoped>
@component-namespace labelmake {
  >>> .labelmake-dialog {
    width: 500px;
    .el-dialog__header {
      padding: 20px 30px !important;
    }
    .el-dialog__headerbtn {
      top: 20px !important;
      right: 30px !important;
    }
    .el-dialog__body {
      padding: 0 30px !important;
      .el-input__inner {
        width: 368px;
      }
    }
    .el-dialog__footer {
      padding: 10px 30px 20px !important;
    }
  }
  >>> .labelmake-dialog__wrapper {
    margin-top: 10px;
    padding-bottom: 40px;
  }
}
</style>
