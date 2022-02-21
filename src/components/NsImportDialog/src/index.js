import ElUpload from '@nascent/nui/lib/upload'

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
  data () {
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
          type: 1 // 选择的type
        }
      },
      file: '',
      IsDelete: false,
      fileList2: [], // 显示的文件列表
      number: 0,
      download: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/downloads/ecrp-sg-web/ImportGuide/%E5%91%98%E5%B7%A5%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'
    }
  },
  watch: {
    'model.manualInput.type' (value) {
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
      this.ImportVisible = true
      this.isCheckAll = false
    },
    onDialogClose () {
      this.number++
      this.fileList2 = this.fileList
      if (this.number % 2 !== 0) { // 判定条件余数为0时为偶数
        this.fileList2 = []
        this.fileList = []
      }
      this.number = 0
      this.ImportVisible = false
      this.isCheckAll = false
    },
    handleExceed (file, fileList) {
      this.$notify.error('已上传文件，不能重复上传')
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
    handleRemove (file, fileList) {
      this.IsDelete = true
      this.number++
      this.fileList2 = fileList
    },
    handleChange (file, fileList) {
      this.number++
      this.file = file
      this.fileList = fileList
      this.fileList2 = fileList
      this.IsDelete = false
    },
    reset () {
      this.fileList2 = []
      this.model = {
        redisKey: '', // 导入文件解析结果缓存key
        manualInput: {
          searchValue: '',
          type: 1 // 选择的type
        }
      }
    },
    save () {
      // if (this.number % 2 === 0) { // 判定条件余数为0时为偶数
      //   this.model.redisKey = null
      // }
      if (this.fileList2.length === 0) {
        this.model.redisKey = null
      }
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
      if ((this.model.manualInput.searchValue === '' && this.model.manualInput.type === '') || this.model.manualInput.searchValue === '' || this.model.manualInput.type === '') {
        params = {
          redisKey: this.model.redisKey,
          manualInput: null
        }
      }
      this.number = 0
      this.$http.fetch(this.$api.guide.guide.importGuideQuery, params)
        .then((resp) => {
          if (resp.success) {
            if (resp.result.errorCount > 0) {
              this.$notify.success('成功匹配员工数' + resp.result.successCount + '(存在' + resp.result.errorCount + '条无效数据可能是：员工已离职，员工不在数据权限范围内，员工信息错误等)')
              this.$emit('acceptImport', resp.result)
              this.ImportVisible = false
            } else {
              this.$notify.success('成功匹配员工数' + resp.result.successCount)
              this.$emit('acceptImport', resp.result)
              this.ImportVisible = false
            }
          } else {
            this.$notify.error(resp.msg)
          }
        }).catch((resp) => {
          this.$notify.error(resp.msg)
        })
    },
    UploadImage (file) {
      this.loading = true
      let param = new FormData()
      param.append('file', file.file)
      this.$http.fetch(this.$api.guide.guide.uploadGuideImportFile, param)
        .then((resp) => {
          if (resp.success) {
            this.model.redisKey = resp.result
            this.$notify.success('上传成功')
            this.loading = false
          } else {
            this.$notify.error(resp.msg)
            this.loading = false
          }
        }).catch((resp) => {
          this.loading = false
          this.$notify.error(resp.msg)
        })
    },
    ManualInputType () {
      this.$http.fetch(this.$api.guide.guide.findManualInputTypeList)
        .then((resp) => {
          this.statusOptions = resp.result
        }).catch((resp) => {
          this.$notify.error('获取类型列表失败', resp.msg)
        })
    }
  },
  mounted () {
    this.ManualInputType()
  }
}
