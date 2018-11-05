<template>
  <el-dialog :title="title" :visible="visible" width="400px"
             append-to-body :before-close="onClose"
             :close-on-click-modal="false">
    <el-form label-width="110px">
      <el-form-item label="自定义文件名：">
        <el-form-grid size="xmd">
          <el-input v-model.trim="aliasFileName" :maxlength="100"></el-input>
        </el-form-grid>
        <el-form-grid>
          <div class="tmp-tips text-info"><i class="el-icon-info"></i>不填入自定义文件名，系统默认生成。</div>
        </el-form-grid>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <ns-button @click="onClose">{{$t('operating.cancel')}}</ns-button>
      <ns-save title="" :loading="confirmBtnLoading" @click="onSave"></ns-save>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'NsExportReport',
    data: function () {
      return {
        visible: false,
        aliasFileName: '',
        confirmBtnLoading: false,
        params: ''
      }
    },
    props: {
      title: {
        type: String,
        default: function () {
          return '生成导出任务'
        }
      },
      createExportTaskApi: {
        type: Object,
        default: function () {
          return this.$api.core.common.createExportTask
        }
      }
    },
    methods: {
      /**
       *  导出
       **/
      export: function (params) {
        this.visible = true
        if (!params) {
          throw new Error('未传入导出参数')
        }
        if (!params.exportSource || !params.hasOwnProperty('exportSource')) {
          throw new Error('导出参数传入错误：[exportSource]')
        }
        if (!params.paramJson || !params.hasOwnProperty('paramJson')) {
          throw new Error('导出参数传入错误：[paramJson]')
        }
        this.params = params
      },
      /**
       *  处理提交参数
       **/
      handleSubmitParams: function (params) {
        let submitParams = {
          paramJson: JSON.stringify(params.paramJson),
          exportSource: params.exportSource,
          // 默认xlsx格式
          exportType: params.exportType ? params.exportType : 3
        }
        if (this.aliasFileName) {
          submitParams.aliasFileName = this.aliasFileName
        }
        return submitParams
      },
      onClose: function () {
        this.aliasFileName = ''
        this.exportTaskId = ''
        this.visible = false
        this.params = ''
      },
      /**
       * 确定更新自定义文件名
       */
      onSave: function () {
        this.confirmBtnLoading = true
        let that = this
        this.$http.fetch(this.createExportTaskApi, this.handleSubmitParams(that.params))
        .then(() => {
          that.$notify.success('导出任务已生成，请到【文件下载】中下载！')
          that.onClose()
        }).catch((resp) => {
          that.$notify.error(resp.msg || '生成导出任务失败')
        }).finally(() => {
          that.confirmBtnLoading = false
        })
      }
    }
  }
</script>
<style scoped>

</style>
