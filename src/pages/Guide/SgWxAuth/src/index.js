import linkminiapp from '@/assets/linkminiapp.png'
export default {
  data () {
    return {
      keyData: [
        {
          name: '介绍',
          key: 'desc'
        },
        {
          name: '认证',
          key: 'isAuth'
        },
        {
          name: '主体信息',
          key: 'mainInformation'
        },
        {
          name: 'appid',
          key: 'appid'
        },
        {
          name: '更新时间',
          key: 'updateTime'
        }
      ],
      isEmpty: true, // 是否未绑定
      displayData: [], // 小程序循环信息
      infoData: {}, // 小程序基本信息
      linkminiapp,
      visible: false,
      isLoad: false,
      dialogVisible: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getInfo()
    },
    getInfo () {
      this.$http.fetch(this.$api.guide.sgwxaccount.findList, { length: 15, start: 0 }).then(res => {
        if (res.success) {
          const { result } = res
          if (result.data && result.data.length) {
            const infoData = result.data.find(item => item.type === 0)
            if (infoData) {
              this.infoData = this.formatInfoData(infoData)
              this.displayData = this.formatDisplayData(this.infoData)
              this.isEmpty = false
            } else {
              this.isEmpty = true
            }
          } else {
            this.isEmpty = true
          }
        }
        this.isLoad = true
      })
    },
    formatInfoData (data) {
      return {
        icon: data.head_img,
        name: data.name,
        desc: data.signature,
        qrcode: data.qrcode_url,
        isAuth: data.verifyType === 0 ? '已认证' : '未认证',
        mainInformation: data.principalName,
        appid: data.appid,
        updateTime: data.update_time,
        id: data.id
      }
    },
    formatDisplayData (data) {
      return this.keyData.map(item => ({
        ...item,
        value: data[item.key]
      }))
    },
    closeDialog () {
      this.visible = false
    },
    /**
     * 微信取消授权处理：逻辑删除小程序
     */
    cancelAuthorization0 () {
      this.infoData.id && this.$http.fetch(this.$api.guide.sgwxaccount.delete, { id: this.infoData.id })
    },
    /**
     * 微信取消授权
     */
    async cancelAuthorization () {
      await this.cancelAuthorization0()
      this.getInfo()
      this.closeDialog()
    },
    /**
     * 取消授权弹框
     */
    handleCancel () {
      this.visible = true
    },
    /**
     * 去授权
     */
    handleAuth () {
      this.$http.fetch(this.$api.guide.sgwxaccount.getAuthUrl, { type: 0 }).then((resp) => {
        window.open(resp.result)
      }).catch((resp) => {
        this.$notify.error(getErrorMsg('保存失败', resp))
      })
    },
    handleClick () {
      this.dialogVisible = true
    }
  }
}
