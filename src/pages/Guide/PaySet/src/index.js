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
          name: '支付密钥',
          isRequire: true,
          value: ''
        },
        {
          key: 'expireApi',
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
          key: 'linkApp',
          name: '关联公众号',
          isRequire: true,
          value: ''
        }
      ],
      btnLoad: false,
      visible: false,
      drawerData: {},
      data: []
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
      this.drawerData = item
      this.changeVisible(true)
      console.log(this.drawerData)
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
        console.log(res)
      })
    },
    /**
     * 获取金额列表
     */
    getList () {
      this.$http.fetch(this.$api.guide.pay.getList, { statr: 0, length: 999 }).then(res => {
        if (res.success) {
          this.data = this.formatList(res.result.data)
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
          value: item[items.key]
        }))
        return { ...item, mapList }
      })
    },
    handleRemove () {
      this.drawerData.expireApi = ''
    },
    beforeUpload () {

    },
    handleUploadSuccess () {

    }
  },
  mounted () {
    this.getWeChatOfficialAccounts()
    this.getList()
  }
}
