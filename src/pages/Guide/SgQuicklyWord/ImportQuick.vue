<template>
  <!--门店商品-->
  <div>
<!--    <ns-button type="primary" @click="dialogVisible = true">导入指标</ns-button>-->
    <el-dialog
      title="导入话术/分类"
      :visible.sync="dialogVisible"
      width="450px"
      response-limit :show-scroll-x=false>
      <div class="indicators-info"
           v-loading="loadingimport"
           element-loading-text="数据导入中，请稍等…">
        <!-- <p>指标年份： <span class="text-danger">{{saveObj.year}}</span> 年</p> -->
        <!-- 导入指标步骤 -->
        <ul class="step">
          <li class="step-item">
            <span class="step-item--index">1</span>
            <div class="step-item--info">
              <ns-button type="primary" class="" v-if="downloadIsShow" @click="downloadQuickTemplate()" >下载模板</ns-button>
              <ns-button type="primary" class="" v-else disabled >下载中</ns-button>
              <p class="step-item--info__text"><Icon type="info-circle" /> 请先下载模板，根据话术内容和对应分类信息填写</p>
              <!-- <p class="step-item--info__text" v-if="type0"><Icon type="info-circle" /> 模板单位为“万元”，请输入0-999999.99的数值</p>
              <p class="step-item--info__text" v-if="type1" ><Icon type="info-circle" /> 模板单位为“人”，请输入大于等于0的整数</p> -->
            </div>
          </li>
          <li class="step-item">
            <span class="step-item--index">2</span>
            <div class="step-item--info">
              <el-upload :disabled = "!loadingIsShow"
                :action= "this.$api.core.sgUploadQuickExcel()"
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
              <!-- <span class="text-danger padding-lr-small" v-if="uploadMsg" >上传文件限制大小5M，格式为.xls或xlsx</span> -->
              <!-- <span class="text-danger padding-lr-small" v-if="uploadFail">上传失败，文档内容校验失败，请下载模版调整</span> -->
              <span class="text-secondary padding-lr-small " v-if="hintMsgIsShowTextDanger"  >  上传文件限制大小5M，格式为.xls或xlsx</span>
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
            <ns-button type="primary"  v-if="updateDataisShow"  @click="importQuickExcel()">提交导入</ns-button>
            <ns-button type="primary"  disabled v-else >提交导入</ns-button>
<!--            <ns-button type="primary"  disabled v-if="updateding" >导入中</ns-button>-->
          </li>
        </ul>
      </div>
    </el-dialog>
    <el-dialog
      title="导入结果"
      :visible.sync="dialogVisibleImportExcel"
      width="450px"
      >
      <div class="importantExcelStatusContent">
        <div class="iconfont">
          <Icon type="xuanzhong" class="xuanzhongfont"/>
        </div>
        <div>成功导入{{importQuickExcelResult.quickGroupSize}}个分类,{{importQuickExcelResult.quickWordSize}}条话术</div>
        <div v-if="importQuickExcelResult.fileSize">导入文件中存在{{importQuickExcelResult.fileSize}}条无效数据
          <ns-button type="text" v-if="importQuickExcelResult.fileSize"  @click="dowloadQuickFileExcel()">查看</ns-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="importExcelClose()">取 消</ns-button>
        <!-- <ns-button type="primary" @click="dialogVisibleImportExcel = false">确 定</ns-button> -->
        <ns-button type="primary" @click="importExcelClose()">确 定</ns-button>
      </span>
  </el-dialog>
  </div>
</template>

<script>
import ElUpload from '@nascent/nui/lib/upload'
// import Loading from '@nascent/nui/lib/loading'
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
      hintMsgIsShowTextDanger: true,
      loadingimport: false,
      updateDataisShow: false,
      uploadSuccee: false,
      downloadIsShow: true,
      loadingIsShow: true,
      improtQuickExcelQuery: {
        excelFileKey: null
      },
      importQuickExcelResult: {
        quickGroupSize: null,
        quickWordSize: null,
        fileSize: null,
        fileExcelUrl: null
      }, // 导入指标弹窗状态
      curMonth: 5,
      dialogVisible: false,
      selectedArr: [],
      shopList: [],
      status: null,
      valid: true,
      dialogVisibleImportExcel: false // 快捷话术上传文件状态
    }
  },
  methods: {
    importExcelClose () {
      this.dialogVisibleImportExcel = false
      this.$emit('outerimportexcel', 'close')
    },
    showToggle (data) {
      this.improtQuickExcelQuery.excelFileKey = null
      this.importQuickExcelResult.quickGroupSize = null
      this.importQuickExcelResult.quickWordSize = null
      this.importQuickExcelResult.fileSize = null
      this.importQuickExcelResult.fileExcelUrl = null
      this.hintMsgIsShowTextDanger = true
      this.uploadSuccee = false
      this.loadingimport = false
      this.updateDataisShow = false
      this.dialogVisible = true
      this.loadingIsShow = true
      this.downloadIsShow = true
    }, // 下载模板
    downloadQuickTemplate () {
      this.downloadIsShow = false
      var url = 'https://shopguide.oss-cn-hangzhou.aliyuncs.com/quickWordExcel/template/%E5%BF%AB%E6%8D%B7%E8%AF%9D%E6%9C%AF%E3%80%81%E5%88%86%E7%B1%BB%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'
      window.location.replace(url)
      setTimeout(() => {
        // window.console.log('定时时间执行')
        this.downloadIsShow = true
      }, 5000)
    }, // 确认更新
    importQuickExcel () {
      const loading = this.$loading({
        lock: true,
        text: '快捷话术文件上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (this.improtQuickExcelQuery.excelFileKey == null || this.improtQuickExcelQuery.excelFileKey === '') {
        this.$notify.warning('EXCEL文件残缺，请刷新后重新上传EXCEL')
        return false
      }
      this.updateDataisShow = true
      // this.loading = true
      // console.log('this.quickExcelName.excelFileKey', this.improtQuickExcelQuery.excelFileKey)
      this.$http
        .fetch(this.$api.guide.guide.importQuickExcel, this.improtQuickExcelQuery)
        .then((response) => {
          if (response.success) {
            // this.loading = false
            this.importQuickExcelResult = response.result
            this.dialogVisibleImportExcel = true
            this.dialogVisible = false
            this.$notify.success('导入成功!')
            loading.close()
          } else {
            loading.close()
            this.$notify.warning('操作失败')
            loading.close()
            // this.loading = false
          }
        })
    },
    dowloadQuickFileExcel () {
      // window.console.log(this.importQuickExcelResult.fileExcelUrl)
      window.location.replace(this.importQuickExcelResult.fileExcelUrl)
    },
    onSuccess (response, file) {
      this.loadingIsShow = true
      if (response.success) {
        this.hintMsgIsShowTextDanger = false
        this.uploadSuccee = true
        this.improtQuickExcelQuery.excelFileKey = response.result.excelFileKey
        // window.console.log(response.result)
        this.updateDataisShow = true
        this.$notify.success(response.msg)
      } else {
        this.updateDataisShow = false
        this.hintMsgIsShowTextDanger = true
        this.uploadSuccee = false
        // this.dialogVisible = false
        this.$notify.warning('上传失败!' + response.msg)
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
      if (fileSuffix !== 'xls' && fileSuffix !== 'xlsx') {
        this.hintMsgIsShowTextDanger = true
        this.uploadFail = true
        this.loadingIsShow = true
        this.uploadSuccee = false
        return false
      }
      if (file.size / 1024 / 1024 > 5) {
        this.hintMsgIsShowTextDanger = true
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
.importantExcelStatusContent {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .iconfont {
    margin-bottom: 10px;
  }
  .xuanzhongfont {
    font-size: 72px;
    color: #0091fa;
  }
}
</style>
