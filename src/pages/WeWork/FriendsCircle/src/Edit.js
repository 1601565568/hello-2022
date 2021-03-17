import sohot from '@/assets/sohot.png'
import nothot from '@/assets/nothot.png'

export default {
  data () {
    return {
      tools: [
        { type: 'tag', text: '插入企业微信员工姓名', id: '$WX_EMPLOYEE_NAME', value: '企业微信员工姓名' },
        // { type: 'tag', text: '插入客户微信昵称', id: '2', value: '客户微信昵称' },
        { type: 'tag', text: '插入企业微信员工门店', id: '$WX_SHOP_NAME', value: '企业微信员工门店' }
      ],
      model: {
        content: '',
        hotLevel: 5, // 好感度
        profileId: [], // 对外信息展示
        userType: 0, // 0 全部员工  1 部分员工
        mediaList: [], // 媒体列表
        guideIds: []
      },
      rules: {},
      btnLoad: false,
      isEdit: false,
      sohot,
      nothot
    }
  },
  computed: {
  },
  methods: {
    /**
     * 初始化
     */
    init () {
      const { uuid } = this.$route.query
      if (uuid) {
        this.isEdit = true
        this.$http.fetch(this.$api.weWork.friendsCircle.adFindById, { uuid }).then((res) => {
          if (res.success) {
            const { result } = res
            this.model = this.formatLoadData(result)
          }
        }).catch((resp) => {
          this.$notify.error(getErrorMsg('加载失败', resp))
        })
      }
    },

    inputLength () {

    },
    handleChangeGuide () {

    },
    /**
     * 格式化通用数据
     * @param {*} model
     */
    formatCommonData (model) {
      return {
        content: model.content,
        hotLevel: model.hotLevel,
        // profileId: model.profileId[0],
        profileId: 1,
        userType: model.userType,
        guideIds: model.guideIds
      }
    },
    /**
     * 格式化渲染数据
     * @param {*} model
     */
    formatLoadData (model) {
      return {
        ...this.formatCommonData(model),
        mediaList: model.imgUrl.split(',')
      }
    },
    /**
     * 格式化请求数据
     * @param {*} model
     */
    formatSaveData (model) {
      return {
        ...this.formatCommonData(model),
        imgUrl: model.mediaList.join(',')
      }
    },
    handleSave () {
      this.onSubmit(this.formatSaveData(this.model))
    },
    handleCancel () {
      this.$router.push({
        path: '/Marketing/FriendsCircle/List'
      })
    },
    onSubmit (model) {
      this.btnLoad = true
      this.$http.fetch(this.$api.weWork.friendsCircle.adPageAdd, model).then(() => {
        this.btnLoad = false
        this.$notify.success('保存成功')
        this.handleCancel()
      }).catch((resp) => {
        this.btnLoad = false
        this.$notify.error(getErrorMsg('保存失败', resp))
      })
    }
  },
  mounted () {
    this.init()
  }
}
