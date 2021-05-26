import { getErrorMsg } from '@/utils/toast'
export default {
  data () {
    return {
      mapItem: [
        {
          key: 'mchid',
          name: '支付商户号',
          isRequire: true,
          value: ''
        },
        {
          key: 'key',
          name: 'API密钥',
          isRequire: true,
          value: ''
        },
        {
          key: 'cert',
          name: 'API证书',
          isRequire: true,
          value: ''
        },
        {
          key: 'expireTime',
          name: '证书有效期',
          value: ''
        },
        {
          key: 'officialAccount',
          name: '关联公众号',
          isRequire: true,
          value: ''
        }
      ],
      btnLoad: false,
      visible: false,
      innerVisible: false,
      isEmpty: false,
      drawerData: {},
      editFlag: false,
      drawerKey: '',
      data: [],
      appIdList: [],
      rules: {
        mchid: [
          { required: true, message: '请输入支付商户号', trigger: ['blur', 'change'] },
          { min: 1, max: 32, message: '长度在1-32个字符', trigger: ['blur', 'change'] }
        ],
        key: [
          { required: true, message: '请输入API密钥', trigger: ['blur', 'change'] },
          { min: 1, max: 32, message: '长度在1-32个字符', trigger: ['blur', 'change'] }
        ],
        cert: [
          { required: true, message: '请选择API证书', trigger: ['blur', 'change'] }
        ],
        mchAppid: [
          { required: true, message: '请选择关联公众号', trigger: ['blur', 'change'] }
        ]
      },
      certName: '' // 文件名称
    }
  },
  methods: {
    /**
     * 打开新建
     */
    handleAdd () {
      this.drawerData = {}
      this.changeVisible(true)
    },
    /**
     * 打开编辑
     */
    handleEdit (item) {
      this.editFlag = true
      this.drawerData = this.formatData(item, 'load')
      this.certName = this.drawerData.cert
      this.drawerKey = item.key
      this.changeVisible(true)
    },
    /**
     * 修改visible
     * @param {boolean} visible
     */
    changeVisible (visible) {
      this.visible = visible
    },
    /**
     * 跳转到说明
     * @param {index} 说明对应下标
     */
    jumpGuide (index) {
      const { href } = this.$router.resolve({ path: `/Guide/Others/PayGuide?step=step${index}` })
      window.open(href, '_blank')
    },
    /**
     * 获取公众号列表
     */
    getWeChatOfficialAccounts () {
      this.$http.fetch(this.$api.guide.pay.getWeChatOfficialAccounts).then(res => {
        if (res.success) {
          this.appIdList = res.result
        }
      })
    },
    /**
     * 获取金额列表
     */
    getList () {
      this.$http.fetch(this.$api.guide.pay.getList, { statr: 0, length: 999 }).then(res => {
        if (res.success) {
          if (res.result.data && res.result.data.length) {
            this.isEmpty = false
            this.data = this.formatList(res.result.data)
          } else {
            this.isEmpty = true
          }
        }
      })
    },
    /**
     * 格式化list内容
     * @param {*} list
     * @return {*} data
     */
    formatList (list) {
      return list.map(item => {
        const mapList = this.mapItem.map(items => ({
          ...items,
          value: items.key === 'expireTime' ? (item.startTime && item.expireTime ? `${item.startTime} 至 ${item.expireTime}` : '-') : item[items.key]
        }))
        return { ...item, mapList }
      })
    },
    handleCancel () {
      this.innerVisible = false
      this.editFlag = false
      this.$refs.form.resetFields()
      this.changeVisible(false)
      this.drawerData = {}
      this.certName = ''
      this.drawerKey = ''
    },
    /**
     * 提交审核
     */
    handleSubmit () {
      // this.editFlag 为true的时候是编辑状态这时要加一个二级弹窗
      if (this.editFlag) {
        this.innerVisible = true
        return false
      }
      this.btnLoad = true
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          this.btnLoad = false
        } else {
          this.onSubmit(this.formatData(this.drawerData, 'submit'))
        }
      })
    },
    /**
     * 编辑状态下二次确认提交审核
     */
    continueToSave () {
      this.editFlag = false
      this.handleSubmit()
    },
    /**
     * 格式化model内容
     * @param {*} data
     * @param {*} type
     */
    formatData (data, type) {
      const obj = {
        cert: data.cert,
        key: data.key,
        mchAppid: data.mchAppid,
        mchid: data.mchid,
        id: data.id
      }
      if (type === 'load') {
        obj.time = data.startTime && data.expireTime ? [data.startTime, data.expireTime] : []
      } else {
        if (data.key === this.drawerKey) {
          obj.key = ''
        }
        obj.startTime = data.time ? data.time[0] : ''
        obj.expireTime = data.time ? data.time[1] : ''
      }
      return obj
    },
    onSubmit (model) {
      const url = model.id ? this.$api.guide.pay.updatePay(model.id) : this.$api.guide.pay.createPay
      this.$http.fetch(url, model).then(() => {
        this.btnLoad = false
        this.getList()
        this.$notify.success('保存成功')
        this.handleCancel()
      }).catch((resp) => {
        this.btnLoad = false
        this.$notify.error(resp.msg)
      })
    },
    handleRemove () {
      this.drawerData.expireApi = ''
    },
    // 上传之前钩子
    beforeUpload (file) {
      // this.fileList = [file]
      // 图片格式判断
      if (!/\.(p12|P12)$/.test(file.name)) {
        this.$notify.error('仅支持上传p12文件')
        return false
      }
      this.certName = file.name
      return true
    },
    handleUploadSuccess (res) {
      if (res.success) {
        this.$set(this.drawerData, 'cert', res.result.path)
      }
    }
  },
  mounted () {
    this.getWeChatOfficialAccounts()
    this.getList()
  }
}
