<template>
  <!--门店商品-->
  <div>
<!--    <ns-button type="primary" @click="dialogVisible = true">导入指标</ns-button>-->
    <el-dialog
      title="导入指标"
      :visible.sync="dialogVisible"
      width="450px"
      response-limit :show-scroll-x=false>
      <div class="indicators-info"
           v-loading="loading"
           element-loading-text="数据导入中，请稍等…">
        <p>指标年份： <span class="text-danger">{{saveObj.year}}</span> 年</p>
        <!-- 导入指标步骤 -->
        <ul class="step">
          <li class="step-item">
            <span class="step-item--index">1</span>
            <div class="step-item--info">
              <ns-button type="primary" class="" v-if="downloadIsShow" @click="ImportTarge" >下载模板</ns-button>
              <ns-button type="primary" class="" v-else disabled >下载中</ns-button>
              <p class="step-item--info__text"><Icon type="info-circle" /> 请先下载模板，填写各门店指标</p>
              <p class="step-item--info__text" v-if="type0"><Icon type="info-circle" /> 模板单位为“万元”，请输入0-999999.99的数值</p>
              <p class="step-item--info__text" v-if="type1" ><Icon type="info-circle" /> 模板单位为“人”，请输入大于等于0的整数</p>
            </div>
          </li>
          <li class="step-item">
            <span class="step-item--index">2</span>
            <div class="step-item--info">
              <el-upload :disabled = "!loadingIsShow"
                :action= "this.$api.core.sgUploadExcel()"
                accept=".xls,.xlsx"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-upload="beforeUpload"
                :before-remove="beforeRemove"
                :on-success="onSuccess"
                :on-exceed="handleExceed"
                :show-file-list="false">
                <ns-button type="primary" v-if="loadingIsShow">上传文件</ns-button>
                <ns-button type="primary" disabled v-else>上传中</ns-button>
              </el-upload>
              <!-- 上传提示 -->
              <span class="text-secondary padding-lr-small " v-if="hintMsgIsShow"  >上传文件限制大小5M，格式为.xls或xlsx</span>
              <span class="text-danger padding-lr-small" v-if="uploadFail">上传失败，文档内容校验失败，请下载模版调整</span>
              <span class="text-danger padding-lr-small " v-if="hintMsgIsShowTextDanger"  >上传文件限制大小5M，格式为.xls或xlsx</span>
              <span class="text-danger padding-lr-small" v-if="uploadFailMsgShow">{{uploadFailMsg}}</span>
              <span class="text-secondary padding-lr-small" v-if="uploadSuccee" >上传成功</span>
              <!-- 上传文件名称-->
<!--              <span class="text-primary padding-lr-small">新加好友指标模版.xls</span>-->
              <!-- 上传失败提示-->
              <p class="step-item--info__text"><Icon type="info-circle" /> 请勿调整下载模板中表头内容，否则可能造成数据错误</p>
              <p class="step-item--info__text"><Icon type="info-circle" /> 上传文件后，系统数据校验需要时间，请勿重复上传</p>
            </div>
          </li>
          <li class="step-item">
            <span class="step-item--index">3</span>
            <ns-button type="primary"  v-if="updateDataisShow"  @click="updateList">提交导入</ns-button>
            <ns-button type="primary"  disabled v-else >提交导入</ns-button>
<!--            <ns-button type="primary"  disabled v-if="updateding" >导入中</ns-button>-->
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ElUpload from '@nascent/nui/lib/upload'
import { API_ROOT } from '@/config/http.js'
import Axios from 'axios'
import api from '@/config/http'
export default {
  props: {
    callBack: Function
  },
  name: 'StoreGood',
  components: {
    ElUpload
  },
  data () {
    return {
      loading: false, // 防重复提交
      saveObj: {
        year: null,
        type: null
      },
      uploadFailMsgShow: false,
      uploadFailMsg: null,
      downloadIsShow: true,
      updateding: false,
      hintMsgIsShowTextDanger: false,
      loadingIsShow: true,
      // downloadIsShow: true,
      updateDataisShow: false,
      type0: false,
      type1: false,
      uploadSuccee: false,
      uploadFail: false,
      hintMsgIsShow: true,
      quotaExcelName: {
        fileKey: null,
        url: null,
        type: null
      },
      curMonth: 5,
      dialogVisible: false,
      selectedArr: [],
      shopList: [],
      status: null,
      valid: true
    }
  },
  methods: {
    showToggle (data) {
      this.uploadFailMsgShow = false
      this.uploadFailMsg = null
      this.dialogVisible = true
      this.loadingIsShow = true
      this.downloadIsShow = true
      this.uploadSuccee = false
      this.uploadFail = false
      this.hintMsgIsShow = true
      this.updateDataisShow = false
      this.hintMsgIsShowTextDanger = false
      this.saveObj.type = data.type
      this.saveObj.year = data.year
      if (data.type !== '0') {
        this.type0 = false
        this.type1 = true
      } else {
        this.type0 = true
        this.type1 = false
      }
    }, // 下载模板
    ImportTarge () {
      this.downloadIsShow = false
      // 重置选择的门店
      var url = API_ROOT + '/guide/importquota/downloadtemplate'
      var form = document.createElement('form')
      form.setAttribute('action', url)
      form.setAttribute('method', 'get')
      var input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', 'year')
      input.setAttribute('value', this.saveObj.year)
      var filename = document.createElement('input')
      filename.setAttribute('type', 'hidden')
      filename.setAttribute('name', 'type')
      filename.setAttribute('value', this.saveObj.type)
      form.appendChild(input)
      form.appendChild(filename)
      document.body.appendChild(form)
      form.submit()
      setTimeout(() => {
        window.console.log('定时时间执行')
        this.downloadIsShow = true
      }, 5000)
    }, // 确认更新
    updateList () {
      if (this.quotaExcelName.fileKey == null || this.quotaExcelName === '') {
        this.$notify.warning('EXCEL文件残缺，请刷新后重新上传EXCEL')
        return false
      }
      this.updateDataisShow = true
      this.loading = true
      this.$http
        .fetch(this.$api.guide.guide.updateList, this.quotaExcelName)
        .then((result) => {
          if (result.success) {
            this.loading = false
            // 回调刷新列表
            this.$notify.success('更新成功')
            this.dialogVisible = false
            this.$props.callBack()
          } else {
            this.$notify.warning('操作失败')
            this.loading = false
          }
        })
        .catch(resp => {
          this.loading = false
        })
    },
    onSuccess (response, file) {
      this.loadingIsShow = true
      if (response.success) {
        this.hintMsgIsShowTextDanger = false
        this.uploadFailMsgShow = false
        this.uploadFailMsg = null
        this.uploadFail = false
        this.hintMsgIsShow = false
        this.quotaExcelName = response.result
        this.updateDataisShow = true
        this.uploadSuccee = true
      } else {
        window.console.log('失败回调' + response.msg)
        this.hintMsgIsShowTextDanger = false
        if (response.code === '1') {
          this.uploadFailMsgShow = true
          this.uploadFailMsg = response.msg
        }
        this.updateDataisShow = false
        this.uploadSuccee = false
        this.hintMsgIsShow = false
        this.uploadFail = true
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
      this.loadingIsShow = false
      let fileSuffix = file.name.split('.').pop()
      console.log('上', fileSuffix)
      console.log('上', (file.size / 1024 / 1024))
      if (fileSuffix !== 'xls' && fileSuffix !== 'xlsx') {
        this.hintMsgIsShowTextDanger = true
        this.uploadFail = true
        this.loadingIsShow = true
        this.uploadSuccee = false
        this.hintMsgIsShow = false
        return false
      }
      if (file.size / 1024 / 1024 > 5) {
        this.hintMsgIsShowTextDanger = true
        this.hintMsgIsShow = false
        this.uploadFail = true
        this.loadingIsShow = true
        this.uploadSuccee = false
        return false
      }
    }
  }
}
</script>

<style scoped>
@import "@theme/variables.pcss";
.indicators-info {
  padding: var(--default-padding-larger);
}
.step {
  padding: var(--default-padding-xlarger) 0;
  list-style: none;
  .step-item {
    position: relative;
    padding: 0 0 30px 50px;
    &:not(:last-child)::before {
      content: ' ';
      position: absolute;
      top: 36px;
      bottom: 6px;
      left: 15px;
      width: 2px;
      background: var(--theme-color-primary);
    }
    .step-item--index {
      position: absolute;
      top: -2px;
      left: 0;
      width: 32px;
      height: 32px;
      color: var(--theme-color-white);
      text-align: center;
      line-height: 32px;
      border-radius: 100%;
      background: var(--theme-color-primary);
    }
    .step-item--info {
      padding-bottom: var(--default-padding-base);
      >>> div {
        display: inline-block;
      }
      .step-item--info__text {
        padding-top: var(--default-padding-larger);
      }
    }
  }
}

</style>
