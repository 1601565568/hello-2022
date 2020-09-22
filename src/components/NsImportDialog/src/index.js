import ElUpload from '@nascent/nui/lib/upload'

let vm
export default {
  components: {
    ElUpload
  },
  props: {
    dialogTitle: {
      type: String,
      default: '导入员工'
    },
    btnTitle: {
      type: String,
      default: '导入'
    },
    type: {
      type: String,
      default: 'text'
    }
  },
  data: function () {
    return {
      uploadData: {
        manualStoreIds: null,
        fileKey: null
      },
      ImportVisible: false,
      text: '',
      placeholder: '请输入员工姓名',
      status: 'name',
      statusOptions: [{ label: '员工姓名', value: 'name' }, { label: '员工手机号', value: 'phone' }, { label: '员工工号', value: 'number' }, { label: '员工登录账号', value: 'account' }]
    }
  },
  watch: {
    status (value) {
      if (value === 'name') {
        this.placeholder = '请输入员工姓名'
      } else if (value === 'phone') {
        this.placeholder = '请输入员工手机号'
      } else if (value === 'number') {
        this.placeholder = '请输入员工工号'
      } else if (value === 'account') {
        this.placeholder = '请输入员工登录账号'
      }
    }
  },
  methods: {
    // 打开弹窗
    onDialogOpen () {
      vm.ImportVisible = true
      vm.isCheckAll = false
    },
    onDialogClose () {
      vm.ImportVisible = false
      vm.isCheckAll = false
    },
    beforeUpload (file, fileList) {
      // console.log('file', file)
      let fileSuffix = file.name.split('.').pop()
      if (fileSuffix !== 'xls' && fileSuffix !== 'xlsx') {
        this.$notify.error('导入文件失败:失败原因 上传文件不能超过5M,支持xls/xlsx格式')
        return false
      }
      if (file.size / 1024 / 1024 > 5) {
        this.$notify.error('导入文件失败:失败原因 上传文件不能超过5M,支持xls/xlsx格式')
        return false
      }
    },
    UploadImage (param) {
      let params = {
        file: param.file
      }
      this.$http.fetch(this.$api.guide.guide.uploadGuideImportFile, params)
        .then((resp) => {
          // console.log('返回结果', resp)
        }).catch((resp) => {
          vm.$notify.error('失败', resp.msg)
        })
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
    handleExceed (files, fileList) {
      this.$notify.error('已上传文件，不能重复上传')
    }
  },
  mounted: function () {
    vm = this
    this.ManualInputType()
  }
}
