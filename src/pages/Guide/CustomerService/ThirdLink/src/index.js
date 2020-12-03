export default {
  data () {
    return {
      rules: {},
      btnLoad: false,
      model: {
        fontColor: '#262626',
        background: '',
        hotZoneData: []
      },
      tools: [{ type: 'tag', text: '成功关联的淘宝账号', id: 'EXTERNAL_CONTACT_NICK', value: '成功关联的淘宝账号' }],
      hotList: [], // 热区列表
      hotVisible: false
    }
  },
  methods: {
    handleSetHot () {
      if (this.model.background) {
        this.hotVisible = true
      } else {
        this.$notify.error(`请先上传背景图`)
      }
    },
    handleCancel () {
      this.hotVisible = false
    },
    setHotData () {}
  }
}
