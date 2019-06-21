
<template>
<!-- 批量设置分组--弹窗  wanrengang 20180802 -->
<div class="addSCBox">
  <el-dialog
  :title="titleText"
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  width="380px"
  :before-close="handleClose">
    <div class="comDialogBoxCon" style="padding:10px 0 20px ">
        <el-form :rules="rules" ref="searchform" :model="saveObj"  :inline="true">
            <el-form-item  label-width="80px" label="分组名称：" prop="subdivision_name">
               <el-input maxlength='20' style="width:250px" v-model="saveObj.subdivision_name" clearable placeholder='请输入分组名称，长度在4-20个字符以内'></el-input>
            </el-form-item>
        </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <ns-button @click="handleClose">取 消</ns-button>
      <ns-button type="primary" :loading="loading" @click="saveFun">确 定</ns-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import { getErrorMsg } from '@/utils/toast'
export default {
  props: {
    callBack: Function
  },
  data () {
    return {
      titleText: '新增素材分组',
      searchform: {},
      loading: false, // 防重复提交
      saveObj: {},
      groudList: [],
      dialogVisible: false,
      rules: {
        subdivision_name: [
          { required: true, message: '请输入分组名称', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在4-20个字符以内', trigger: 'blur' }
        ]
      }
    }
  },
  created: function () {},
  methods: {
    showToggle (obj) {
      if (obj.subdivision_id) {
        this.titleText = '编辑素材分组'
      } else {
        this.titleText = '新增素材分组'
      }
      this.saveObj = JSON.parse(JSON.stringify(obj))
      this.dialogVisible = true
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    delImgFun (index) {
      this.imgList.splice(index, 1)
    },

    // 提交保存
    saveFun () {
      this.$refs.searchform.validate(valid => {
        if (valid) {
          this.doSave()
        }
      })
    },
    async doSave () {
      this.loading = true
      await this.$http
        .fetch(this.$api.guide.materialGroudDeit, this.saveObj)
        .then(resp => {
          this.handleClose()
          // 回调刷新列表
          this.$props.callBack()
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.loading = false
    },
    handleClose () {
      this.$refs.searchform.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
