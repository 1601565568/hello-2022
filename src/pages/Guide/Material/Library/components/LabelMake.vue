<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="hide"
    :close-on-click-modal="false"
    :append-to-body="appendToBody"
    customClass="labelmake-dialog"
  >
    <div class="labelmake-dialog__wrapper">
      <el-form ref="form" :rules="rules" label-width="72px" :model="model">
        <el-form-item label="选择标签：" prop="subdivisionId">
          <el-select
            v-model="model.subdivisionIds"
            placeholder="请选择标签"
            multiple
            :collapse-tags="true"
            :clearable="false"
          >
            <el-option
              v-for="item in list"
              :key="item.subdivisionId"
              :label="item.subdivisionName"
              :value="item.subdivisionId">
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
      title: '批量打标签',
      visible: false,
      loading: false,
      list: [],
      selectRows: [],
      model: { subdivisionIds: null },
      rules: {
        subdivisionIds: [
          { required: true, message: '请选择标签', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    descStr () {
      let numArr = [{ num: 0, suffix: '条素材' }, { num: 0, suffix: '个文件夹（将应用于文件夹下所有素材）' }]
      this.selectRows.forEach(o => {
        o.isDirectory === 1 ? numArr[1].num++ : numArr[0].num++
      })
      let strArr = numArr.map(o => o.num ? `${o.num}${o.suffix}` : '').filter(s => !!s)
      return `已选择${strArr.join('、')}`
    }
  },
  methods: {
    show (selectRows = [], labelList = []) {
      this.visible = true
      this.selectRows = selectRows
      this.list = labelList
      if (!this.list.length) {
        this.loadList()
      }
    },
    hide () {
      this.visible = false
      this.$refs.form.resetFields()
    },
    loadList () {
      this.$http
        .fetch(this.$api.guide.materialGroudListAll, {})
        .then(resp => {
          this.list = resp.result
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    handleSave () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = { subdivisionIds: this.model.subdivisionIds }
          params.itemList = this.selectRows.map(item => ({
            id: item.id,
            isDirectory: item.isDirectory,
            parentPath: item.parentPath
          }))
          this.$emit('setSubdivision', params)
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
    .el-dialog__body {
      .el-select--small {
        width: 100%;
      }
    }
  }
  >>> .labelmake-dialog__wrapper {
    margin-top: 10px;
    padding: 0 0px 30px;
  }
}
</style>
