<template>
  <div>
<!--    <ns-button @click="onOpendialog">默认弹窗</ns-button>-->
    <el-dialog
      append-to-body
      title="外部店铺编码"
      :visible.sync="dialogVisible"
      :close-on-press-escape='true'
      :close-on-click-modal='false'
      :response-limit=false
      :before-close="handleClose"
      width="600"
    >
      <!-- 弹窗内容 -->
      <ElTabs v-model="activeName" class="taskStore-wrapper">
        <ElTabPane  loaded="true" label="手动输入" name="first">
          <ElForm>
            <ElInput
              type="textarea"
              placeholder="手动输入外部店铺编码"
              v-model="manualValue"
              resize="none"
            />
          </ElForm>
          <div class="taskStore-wrapper__text text-primary">
            <Icon type="exclamation-circle" theme="outlined" />
            <span>输入多个外部店铺编码用“,”隔开</span>
          </div>
        </ElTabPane>
        <ElTabPane label="文件导入" name="second">
          <ElForm label-width="64px">
            <ElFormItem label="上传文档：">
              <ElUpload
                ref= "uploadRef"
                :action= "this.$api.core.importFileShopIds()"
                :data="uploadData"
                accept=".xls,.xlsx"
                :on-preview="handlePreview"
                :before-upload="beforeUpload"
                :on-success="onSuccess"
                :on-exceed="handleExceed"
                :multiple = "false"
                :limit="1">
                <NsButton size="small" type="primary">选择文件</NsButton>
              </ElUpload>
            </ElFormItem>
            <div class="taskStore-wrapper__text text-warning">
              <Icon type="exclamation-circle" theme="outlined" />
              <span>您可使用系统提供的模板填写信息并导入，只支持选中当前体系的店铺。 </span>
              <NsButton type="text" @click="downloadTaskTemple">下载模板</NsButton>
            </div>
          </ElForm>
        </ElTabPane>
      </ElTabs>
      <template slot="footer">
        <div class="taskStore-footer">
          <ns-button @click="dialogVisible = false">取 消</ns-button>
          <ns-button type="primary" @click="okFun">确 认</ns-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { API_ROOT } from '@/config/http.js'
import ElUpload from '@nascent/nui/lib/upload'

export default {
  components: {
    ElUpload
  },
  data () {
    return {
      activeName: 'first',
      dialogVisible: false,
      manualValue: null,
      uploadData: {
        manualStoreIds: null,
        fileKey: null
      },
      sgUploadTaskExcel: null,
      loading: false,
      storeInfo: {
        successSize: 0,
        failSize: 0,
        fileIds: null
      }
    }
  },
  watch: {
    manualValue: {
      handler (newValue) {
        this.uploadData.manualStoreIds = newValue
      }
    }
  },
  methods: {
    handleClose (done) {
      // done()
      this.dialogVisible = false
      this.manualValue = null
      this.$refs.uploadRef.clearFiles()
    },
    okFun () {
      let tempShopArray = []
      let isExecute = false
      let tempShopStr = []
      let temp = this.manualValue ? this.manualValue.replace(/[\r\n]/g, '') : ''
      if (temp !== '' && temp !== null) {
        if (temp.startsWith(',') || temp.endsWith(',') || temp.startsWith('，') || temp.endsWith('，')) {
          this.$notify.info('请输入正确的外部店铺编码')
          return false
        } else {
          tempShopArray = temp.split(',')
          tempShopArray.forEach(shop => {
            if (shop.startsWith(',') || shop.endsWith(',') || shop.startsWith('，') || shop.endsWith('，')) {
              this.$notify.info('请输入正确的外部店铺编码')
              isExecute = true
            } else {
              tempShopStr.push(shop.trim())
            }
          })
          if (isExecute) {
            return false
          }
          this.uploadData.manualStoreIds = tempShopStr.join(',')
        }
      } else {
        this.uploadData.manualStoreIds = ''
      }
      this.$http.fetch(this.$api.guide.importFileAndManual, this.uploadData)
        .then(resp => {
          if (resp.success) {
            this.$notify.info('已成功' + resp.result.successSize + ',失败' + resp.result.failSize + '(失败原因:店铺关闭、店铺不在体系下、店铺编码错误等)')
            this.storeInfo = resp.result
            this.$emit('callBack', this.storeInfo)
            this.dialogVisible = false
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('保存失败', resp))
        })
    },
    // 下载模板
    downloadTaskTemple () {
      var url = API_ROOT + '/guide/task/downloadTaskTemple'
      var form = document.createElement('form')
      form.setAttribute('action', url)
      form.setAttribute('method', 'get')
      document.body.appendChild(form)
      form.submit()
    },
    onOpendialog () {
      this.dialogVisible = true
      this.uploadData.manualStoreIds = null
      this.uploadData.fileKey = null
      this.manualValue = null
      this.$nextTick(function () {
        this.$refs.uploadRef.clearFiles()
      })
    },
    onSearch () {
      // console.log('搜索响应')
    },
    onChange (data) {
      // console.log(data)
    },
    handleChange (value) {
      // console.log(value)
      this.dialogVisible = false
    },
    onSuccess (response, file) {
      if (response.success) {
        this.storeInfo = response.result
        this.uploadData.fileKey = response.result.fileKey
        this.$notify.info('已成功' + response.result.successSize + ',失败' + response.result.failSize + '(失败原因:店铺关闭、店铺不在体系下、店铺编码错误等)')
      } else {
        this.$refs.uploadRef.clearFiles()
        if (response.code === '1') {
          this.$notify.error('导入文件失败:' + response.msg)
        } else {
          this.$notify.error('操作未成功!')
        }
      }
    },
    handleRemove (file, fileList) {
    },
    handlePreview (file) {
    },
    handleExceed (files, fileList) {
      this.$notify.error('已上传文件，不能重复上传')
    },
    beforeRemove (file, fileList) {
    },
    beforeUpload (file, fileList) {
      let fileSuffix = file.name.split('.').pop()
      if (fileSuffix !== 'xls' && fileSuffix !== 'xlsx') {
        this.$notify.error('导入文件失败:失败原因 上传文件不能超过5M,支持xls/xlsx格式')
        return false
      }
      if (file.size / 1024 / 1024 > 5) {
        this.$notify.error('导入文件失败:失败原因 上传文件不能超过5M,支持xls/xlsx格式')
        return false
      }
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>

<style scoped>
  @import "@theme/variables.pcss";
  @component-namespace taskStore {
    @b wrapper {
      padding: 10px;
      height: 288px;
      >>> .el-form {
        padding: 20px 0 8px;
        textarea {
          padding: 6px 10px;
          height: 190px;
        }
        .taskStore-wrapper__text {
          margin-left: 64px;
          margin-top: 8px;
        }
        .el-upload-list {
          font-size: 0;
          line-height: 1;
          .el-upload-list__item {
            display: inline-block;
            width: auto;
            padding: 0 8px;
            background-color: #f1f2f4;
            > a {
              font-size: 12px;
              color: #0091fa;
              i {
                font-size: 14px;
              }
            }
            line-height: 28px;
            .el-icon-close {
              display: inline-block;
              top: 7px;
              right: 8px;
            }
          }
          .el-upload-list__item-status-label {
            display: none;
          }
        }
      }
      @e text {
        > svg,
        > span {
          font-size: 12px;
        }
        > svg + span {
          margin-left: 4px;
        }
        > span + button {
          margin-left: 10px;
          padding: 3px 0;
          font-weight: normal;
        }
      }
    }
    @b footer {
      padding: 10px;
      button + button {
        margin-left: 10px;
      }
    }
  }
</style>
