
<template>
<!-- 批量设置分组--弹窗  wanrengang 20180802 -->
<div class="addSCBox">
  <el-dialog
  title="批量设置分组"
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  width="320px"
  :before-close="handleClose">
    <div class="comDialogBoxCon" style="padding:10px 0 20px ">
        <el-form ref="searchform" :model="saveObj"  :inline="true">
            <el-form-item  label-width="100px" :rules="{required: true, message: '请选择分组', trigger: 'change'}" label="请选择分组：" prop="subdivision_id">
                <el-select style="width:180px" v-model="saveObj.subdivision_id" placeholder="请选择" clearable>
                    <el-option v-for="item in groudList"
                        :key="item.subdivision_id"
                        :label="item.subdivision_name"
                        :value="item.subdivision_id">
                        </el-option>
                    </el-select>
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
export default {
  props: {
    callBack: Function
  },
  data () {
    return {
      searchform: {},
      loading: false, // 防重复提交
      saveObj: {},
      groudList: [],
      dialogVisible: false
    }
  },
  created: function () {},
  methods: {
    showToggle (ids, groudList) {
      let idsArr = []
      for (let i = 0, len = ids.length; i < len; i++) {
        idsArr.push(ids[i].id)
      }
      this.saveObj.ids = idsArr.join(',')
      console.log(idsArr)
      this.groudList = groudList
      this.dialogVisible = true
    },
    handleSelectionChange (val) {
      console.log(val)
      this.multipleSelection = val
    },
    delImgFun (index) {
      this.imgList.splice(index, 1)
      console.log(index)
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
        .fetch(this.$api.guide.materialSetGroud, this.saveObj)
        .then(resp => {
          this.handleClose()
          // 回调刷新列表
          this.$props.callBack()
        })
        .catch(resp => {
          this.$notify.error(resp.msg)
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