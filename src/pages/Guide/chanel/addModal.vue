
<template>
  <!-- 新增、编辑渠道 -->
  <div class="addMaterialbox">
    <el-dialog :title="modalTit" :close-on-click-modal=false :visible.sync="dialogVisible" width="500px" :before-close="handleClose" class="custom-box">
      <div class="comDialogBoxCon">
        <el-form :model="saveObj" :rules="rules" ref="addForm" label-width="100px" style="width:440px;">
          <el-form-item label="渠道名称：" prop="content">
            <el-input resize="none" type="text" maxlength='30' v-model="saveObj.content" placeholder="可在此输入推广文案，限制长度在10000个字符以内。"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="handleClose">取 消</ns-button>
        <ns-button type="primary" :loading="loading" @click="saveFun">保存</ns-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getErrorMsg } from '@/utils/toast'
import listPageMixin from '@/mixins/listPage'
export default {
  mixins: [listPageMixin],
  components: {
  },
  props: {
    callBack: Function
  },
  data () {
    return {
      loading: false,
      modalTit: '新增渠道',
      dialogVisible: false,
      saveObj: {
        id: '',
        content: null,
        speechId: null
      },
      rules: {
        content: [
          { required: true, message: '请输入渠道名称', trigger: 'blur' },
          { min: 0, max: 30, message: '限制长度在30个字符以内', trigger: 'blur' },
          { pattern: /^(?!(\s+$))/, message: '不允许为空' }
        ]
      }
    }
  },
  created: function () {},
  methods: {
    showToggle (obj) {
      let that = this
      if (obj.id) {
        that.modalTit = '编辑渠道'
        that.saveObj = {
          id: obj.id,
          content: obj.content
        }
      } else {
        // 数据重置
        that.modalTit = '新增渠道'
        that.saveObj = {
          id: '',
          content: ''
        }
      }
      that.dialogVisible = true
    },
    // 提交保存
    saveFun () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.doSave()
        }
      })
    },
    async doSave () {
      this.searchObj.searchMap.id = this.saveObj.id
      this.searchObj.searchMap.content = this.saveObj.content
      this.searchObj.searchMap.speechId = this.saveObj.speechId
      this.loading = true
      await this.$http
        .fetch({
          url: '/Guide/chanel/saveupdate',
          method: 'post'
        }, this.searchObj)
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
      // 置空
      this.saveObj.content = ''
      this.saveObj.id = ''
      this.dialogVisible = false
      this.$refs.addForm.resetFields()
    }
  }
}
</script>
<style scoped>
/* 此处scoped暂时不能加，等空闲了再出解决方案 */
.addMaterialbox >>> .custom-box {
  .comDialogBoxCon {
    padding-bottom: 20px;
  }
  .comUploadBox {
    width: 330px;
  }
  .comUploadBox {
    .el-upload--picture-card {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .el-upload--picture-card {
      img {
        width: 78px;
        height: 78px;
      }
    }
    .comUploadList {
      padding: 0;
      width: 100%;
      box-sizing: border-box;
      li {
        float: left;
        width: 80px;
        height: 80px;
        margin: 5px 5px 5px 0;
        border-radius: 3px;
        list-style: none;
        overflow: hidden;
      }
    }
  }
  .comUploadList li.imgItem {
    position: relative;
  }
  .comUploadList li.imgItem .del {
    position: absolute;
    cursor: pointer;
    width: 80px;
    height: 80px;
    top: 0;
    left: 0;
    z-index: 5;
    text-align: center;
    line-height: 80px;
    color: #fff;
    display: none;
    background-color: black;
    opacity: 0.6;
  }
  .comUploadList li.imgItem:hover .del {
    display: block;
  }
  .comUploadList li img {
    width: 80px;
    height: 80px;
    border: 1px solid #fcfcfc;
  }
  .comUploadImg {
    width: 80px;
    height: 80px;
  }
}
</style>
