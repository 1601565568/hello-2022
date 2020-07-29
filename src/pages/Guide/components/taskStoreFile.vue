<template>
  <div class="form-main">
<!--    <ns-button @click="onOpendialog">默认弹窗</ns-button>-->
    <el-dialog
      title="外部店铺编码"
      :visible.sync="dialogVisible"
      width="800px"
      height="500px"
      :close-on-press-escape='true'
      :close-on-click-modal='false'
      :response-limit=false
      append-to-body
      :before-close="handleClose"
    >
      <!-- 弹窗内容 -->
      <ElTabs v-model="activeName">
        <ElTabPane  loaded="true" label="手动输入" name="first">
          <ElForm class="form-main">
            <ElInput
              type="textarea"
              :rows="16"
              placeholder="手动输入外部店铺编码"
              v-model="manualValue" />
          </ElForm>
        </ElTabPane>
        <ElTabPane label="文件导入" name="second">
          <ElForm class="form-main">
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
              <NsButton size="small" type="primary">点击上传</NsButton>
              <div slot="tip" class="el-upload__tip">
                <div class="tmp-tips text-warning"><Icon type="exclamation-circle" theme="outlined" />
                  您可使用系统提供的模板填写信息并导入，只支持选中当前视角的店铺. <NsButton type="text" @click="downloadTaskTemple" > 下载模板</NsButton>
                </div>
              </div>
            </ElUpload>
          </ElForm>
        </ElTabPane>
      </ElTabs>
      <template slot="footer">
         <ns-button @click="dialogVisible = false">取 消</ns-button>
         <ns-save @click="okFun" ></ns-save>
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
        ids: null
      }
    }
  },
  watch: {
    manualValue: {
      handler (newValue) {
        this.uploadData.manualStoreIds = newValue
        // console.log('manualValue', newValue)
      }
    }
  },
  methods: {
    handleClose (done) {
      // done()
      this.dialogVisible = false
      this.manualValue = null
      this.$refs.uploadRef.clearFiles()
      // this.$confirm('确认关闭？').$http.fetch
      //   .then(() => {
      //     done()
      //   })
      //   .catch(() => {})
    },
    okFun () {
      let tempShopArray = []
      let tempShopStr = []
      let temp = this.manualValue
      if (temp !== '' && temp !== null) {
        if (temp.startsWith(',') || temp.endsWith(',') || temp.startsWith('，') || temp.endsWith('，')) {
          this.$notify.info('请输入正确的外部店铺编码')
          return false
        } else {
          tempShopArray = this.manualValue.split(',')
          tempShopArray.forEach(shop => tempShopStr.push(shop.trim()))
          this.uploadData.manualStoreIds = tempShopStr.join(',')
        }
      } else {
        this.uploadData.manualStoreIds = ''
      }
      this.$http.fetch(this.$api.guide.importFileAndManual, this.uploadData)
        .then(resp => {
          if (resp.success) {
            this.$notify.info('已成功' + resp.result.successSize + ',失败' + resp.result.failSize + '(失败原因:店铺关闭、店铺不在视角下、店铺编码错误等)')
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
        this.$notify.info('已成功' + response.result.successSize + ',失败' + response.result.failSize + '(失败原因:店铺关闭、店铺不在视角下、店铺编码错误等)')
        // window.console.log('解析excel店铺id=>' + this.storeInfo.ids)
      } else {
        this.$refs.uploadRef.clearFiles()
        if (response.code === '1') {
          this.$notify.error('导入文件失败:' + response.msg)
        } else {
          this.$notify.error('操作未成功!')
          window.console.log('失败回调' + response.msg)
        }
      }
    },
    handleRemove (file, fileList) {
    },
    handlePreview (file) {
    },
    handleExceed (files, fileList) {
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
  /* 关联店铺的样式*/
  .relevance-shop__title{
    padding:var(--default-margin-base) var(--default-margin-base) var(--default-margin-larger);
    i{
      background: var(--theme-color-primary);
      width: 24px;
      height:24px;
      border-radius: 100%;
      color:#fff;
      display: inline-block;
      margin-right: 3px;
      &:before{
        font-size: 14px;
        line-height: 22px;
        position: relative;
        left: 4px;
        top: 0;
      }
    }
  }
  .relevance-shop__main{
    >>> .el-form{
      padding:var(--default-margin-base);
    }
    width:100%;
    border:1px solid var(--theme-base-border-color-primary);
    .relevance-shop__content{
      padding:var(--default-margin-base);
      width:100%;
      >>> .el-checkbox{
        width:32.7%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right:var(--default-margin-base);
        &+.el-checkbox{
          margin-left:0;
        }
      }
    }
    .relevance-shop__footer{
      border-top:1px solid var(--theme-base-border-color-primary);
      padding:var(--default-margin-base);
      >>> .el-checkbox{
        line-height: var(--default-form-item-small-height);
      }
      >>> .el-pagination{
        padding:0;
        display: inline-block;
      }
    }
  }
  /* 关联店铺的样式-end*/

  /* 发放优惠券样式 */
  .border-top{
    width:100%;
    height: 0;
    border-top:1px solid var(--theme-base-border-color-primary);
  }
  .coupon{
    position: absolute;
    top:5px;
    right:60px;
    font-size:13px;
  }
  .coupon-preview{
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius:5px;
    border:1px solid var(--theme-base-border-color-primary);
    border-bottom-style:dashed;
    padding:10px;
  }
  .coupon-amount__large{
    font-size: 28px;
  }
  .coupon-preview-title{
    padding-left:15px;
  }
  .coupon-decorate{
    background: var(--theme-color-warning);
    color:#fff;
    margin-left: 10px;
    padding: 3px 6px 2px;
    font-size: 12px;
  }
  .coupon-preview-bottom{
    font-size: 12px;
    border-radius:5px;
    border:1px solid var(--theme-base-border-color-primary);
    border-top-style:dashed;
    padding:3px 10px;
    color:var(--theme-font-color-secondary);
    margin-top: -1px;
  }
  /* 发放优惠券样式-end */

  /* tab样式 */
  .tab-center--two .tab-line-reset >>> .el-tabs__header{
    background: #fff;
  }
  .tab-center--two .tab-line-reset  >>> .el-tabs__nav{
    border:none;
    border-radius: 0;
    float:left;
  }
  .tab-center--two .tab-line-reset  >>> .el-tabs__item.is-active{
    background: none;
    color:var(--theme-color-primary);
  }
  .tab-center--two .tab-line-reset  >>> .el-tabs__item, .tab-line-reset  >>> .el-tabs__item{
    padding:var(--tab-center-two-vertical-padding) var(--tab-center-two-horizontal-padding);
    font-size:var(--tab-center-two-font-size);
    color:var(--theme-font-color-regular);
  }
  .tab-center--two {
    >>> .el-tabs__header{
      background: none;
      text-align: center;
      border: none;
      margin-bottom:var(--default-margin-xlarger);
    }
  }
  .tab-center--two  >>> .el-tabs__nav{
    border:1px solid var(--theme-color-primary);
    border-radius: var(--default-radius-mini);
    display: inline-block;
    float:none;
  }
  .tab-center--two  >>> .el-tabs__item.is-active{
    background: var(--theme-color-primary);
    color:var(--theme-bg-color-base);
  }
  .tab-center--two  >>> .el-tabs__item, .tab-center--two  >>> .el-tabs__item{
    padding:var(--tab-center-two-vertical-padding) var(--tab-center-two-horizontal-padding);
    font-size:var(--tab-center-two-font-size);
    color:var(--theme-color-primary);
  }
  .el-tabs--top >>> .el-tabs__item.is-top:last-child{
    padding-right:var(--tab-center-two-horizontal-padding);
  }
  .el-tabs--top >>> .el-tabs__item.is-top:nth-child(2){
    padding-left:var(--tab-center-two-horizontal-padding);
  }
  /* 页面结构标题样式 */
  .page-title {
    font-size: var(--default-font-size-base);
    padding-bottom: var(--default-padding-larger);
    font-weight: bold;
  }
</style>
