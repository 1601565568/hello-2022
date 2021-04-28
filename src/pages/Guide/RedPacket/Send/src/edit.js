import qychat from '@/assets/qychat.png'
export default {
  data () {
    return {
      qychat,
      model: {
        useType: 1,
        guideIds: [],
        redpackPolicyId: '',
        shopIds: []
      },
      rules: {
        useType: [
          { required: true, message: '请选择发放对象', trigger: ['blur', 'change'] }
        ],
        redpackPolicyId: [
          { required: true, message: '请选择红包策略', trigger: ['blur', 'change'] }
        ],
        shopIds: [
          { required: true, message: '请选择门店', trigger: ['blur', 'change'] }
        ],
        guideIds: [
          { required: true, message: '请选择员工', trigger: ['blur', 'change'] }
        ]
      },
      visible: false,
      btnLoad: false,
      redpacketName: ''
    }
  },
  methods: {
    handleChangeGuide (value) {
      this.model.guideIds = value.map(item => item.id)
      this.$refs.searchform && this.$refs.searchform.validateField('guideIds')
    },
    handleChangeShopList (value) {
      this.model.shopIds = value
      this.$refs.searchform && this.$refs.searchform.clearValidate('shopIds')
    },
    // 返回列表
    handleCancel () {
      this.$router.push({ path: '/Social/SocialOperation/RedPacket/Send/List' })
    },
    hanleChoose () {
      this.changeVisible(true)
    },
    changeVisible (visible) {
      this.visible = visible
    },
    handleSure () {
      const checkedItem = this.$refs.strategiesList.checkItem
      if (!checkedItem.id) {
        return
      }
      this.model.redpackPolicyId = checkedItem.id
      this.redpacketName = checkedItem.name
      this.changeVisible(false)
    },
    update () {
      this.btnLoad = true
      this.$refs.searchform.validate(valid => {
        if (valid) {
          this.doUpdate()
        } else {
          this.btnLoad = false
        }
      })
    },
    doUpdate () {
      this.$http.fetch(this.$api.guide.redpacket.createSend, this.model).then(() => {
        this.btnLoad = false
        this.$notify.success('保存成功')
        this.handleCancel()
      }).catch((resp) => {
        this.btnLoad = false
        this.$notify.error(getErrorMsg('保存失败', resp))
      })
    }
  }
}
