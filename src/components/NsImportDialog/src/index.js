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
      fileList: [],
      loading: false, // 防重复提交
      ImportVisible: false,
      placeholder: '请输入员工姓名',
      statusOptions: [],
      model: {
        redisKey: '', // 导入文件解析结果缓存key
        manualInput: {
          searchValue: '',
          type: '' // 选择的type
        }
      },
      download: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/downloads/ecrp-sg-web/ImportGuide/%E5%91%98%E5%B7%A5%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xls'
    }
  },
  watch: {
    status (value) {
      if (value === 1) {
        this.placeholder = '请输入员工姓名'
      } else if (value === 2) {
        this.placeholder = '请输入员工手机号'
      } else if (value === 3) {
        this.placeholder = '请输入员工工号'
      } else if (value === 4) {
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
    save () {
      let params = {
        redisKey: this.model.redisKey, // 导入文件解析结果缓存key
        manualInput: {
          searchValue: this.model.manualInput.searchValue,
          type: this.model.manualInput.type // 选择的type
        }
      }
      if (this.model.redisKey === '') {
        params.redisKey = null
      }
      if (this.model.manualInput.searchValue === '' && this.model.manualInput.type === '') {
        params = {
          redisKey: this.model.redisKey,
          manualInput: null
        }
      }
      if ((this.model.manualInput.searchValue === '' && this.model.manualInput.type !== '') || (this.model.manualInput.searchValue !== '' && this.model.manualInput.type === '')) {
        vm.$notify.error('请检查数据是否填写完整')
        return
      }

      this.$http.fetch(this.$api.guide.guide.importGuideQuery, params)
        .then((resp) => {
          if (resp.success) {
            if (resp.result.errorCount > 0) {
              vm.$notify.success('成功匹配员工数' + resp.result.successCount + '(存在' + resp.result.errorCount + '条无效数据可能是：员工已离职，员工不在数据权限范围内，员工信息错误等)')
              this.$emit('acceptImport', resp.result)
              vm.ImportVisible = false
            } else {
              vm.$notify.success('成功匹配员工数' + resp.result.successCount)
              this.$emit('acceptImport', resp.result)
              vm.ImportVisible = false
            }
          } else {
            vm.$notify.error(resp.msg)
          }
        }).catch((resp) => {
          vm.$notify.error(resp.msg)
        })
    },
    // 这一步，是 展示最后一次选择的文件
    handleChange (file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
    },
    UploadImage (file) {
      this.loading = true
      let param = new FormData()
      param.append('file', file.file)
      this.$http.fetch(this.$api.guide.guide.uploadGuideImportFile, param)
        .then((resp) => {
          if (resp.success) {
            this.model.redisKey = resp.result
            vm.$notify.success('上传成功')
            this.loading = false
          } else {
            vm.$notify.error(resp.msg)
            this.loading = false
          }
        }).catch((resp) => {
          this.loading = false
          vm.$notify.error(resp.msg)
        })
    },
    ManualInputType () {
      this.$http.fetch(this.$api.guide.guide.findManualInputTypeList)
        .then((resp) => {
          this.statusOptions = resp.result
        }).catch((resp) => {
          vm.$notify.error('获取类型列表失败', resp.msg)
        })
    }
  },
  mounted: function () {
    vm = this
    this.ManualInputType()
  }
}
