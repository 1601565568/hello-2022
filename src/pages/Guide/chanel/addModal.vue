<template>
  <!-- 新增、编辑渠道 -->
  <div class="addMaterialbox">
    <el-dialog :title="modalTit" :close-on-click-modal=false :visible.sync="dialogVisible" width="500px"
               :before-close="handleClose" class="custom-box">
      <div class="comDialogBoxCon">
        <el-form :model="model" :rules="rules" ref="addForm" label-width="100px" style="width:440px;">
          <el-form-item label="渠道名称：" prop="channelName">
            <el-input resize="none" type="text" maxlength='30' v-model="model.channel_name" placeholder="请输入渠道名称"></el-input>
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
import listPageMixin from '@/mixins/listPage'
export default {
  mixins: [listPageMixin],
  components: {},
  props: {
    callBack: Function
  },
  data () {
    return {
      loading: false,
      modalTit: '新增渠道',
      dialogVisible: false,
      model: {
        id: '',
        channel_name: null
      },
      rules: {
        channel_name: [
          { required: true, message: '请输入渠道名称', trigger: 'blur' },
          { min: 0, max: 30, message: '限制长度在30个字符以内', trigger: 'blur' },
          { pattern: /^(?!(\s+$))/, message: '不允许为空' }
        ]
      }
    }
  },
  created: function () {
  },
  methods: {
    showToggle (obj) {
      let that = this
      if (obj.id) {
        that.modalTit = '编辑渠道'
        that.model = {
          id: obj.id,
          channel_name: obj.channel_name
        }
      } else {
        // 数据重置
        that.modalTit = '新增渠道'
        that.model = {
          id: '',
          channel_name: ''
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
    doSave: function () {
      var info = ''
      if (this.model.id && this.model.id > 0) {
        info = '修改'
      } else {
        info = '新增'
      }
      this.loading = true
      this.$http
        .fetch({
          url: '/Guide/chanel/saveOrUpdate',
          method: 'post'
        }, this.model)
        .then(resp => {
          if (resp.success) {
            this.$notify.success({ message: info + '渠道成功' })
            this.handleClose()
            // 回调刷新列表
            this.$props.callBack()
          }
        })
        .catch(resp => {
          if (resp.msg) {
            this.$notify.error(resp.msg)
          } else {
            this.$notify.error({ message: info + '渠道失败' })
          }
        })
      this.loading = false
    },
    handleClose () {
      // 置空
      this.model.channel_name = ''
      this.model.id = ''
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
