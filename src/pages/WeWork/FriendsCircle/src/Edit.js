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
      model: { // 提交信息
        content: '',
        hotLevel: 0, // 好感度
        profileId: '', // 对外信息展示
        userType: 0, // 0 全部员工  1 部分员工
        mediaList: [], // 媒体列表
        type: '', // 类型img 图片 video 视频
        guideIds: []
      },

      styleData: {}, // 样式信息
      rules: {},
      btnLoad: false,
      isEdit: false,
      visible: false,
      sohot,
      nothot
    }
  },
  computed: {
    textConTent () {
      if (this.$refs.testText) {
        this.$refs.testText.stringTotext(this.model.content)
      }
      return ''
    }
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
      this.activityIntroductionLength = length
    },
    /**
     * 删除导购
     * @param {*} index
     */
    handleDelect (index) {
      this.model.guideIds.splice(index, 1)
      this.$refs.ruleForm && this.$refs.ruleForm.validateField('guideIds')
    },
    /**
     * 删除所有导购
     * @param {*} value
     */
    handleDelectAll () {
      this.model.guideIds = []
      this.$refs.ruleForm && this.$refs.ruleForm.validateField('guideIds')
    },
    /**
     * 选择导购
     * @param {*} value
     */
    handleChangeGuide (value) {
      this.model.guideIds = value
      this.$refs.ruleForm && this.$refs.ruleForm.validateField('guideIds')
    },
    /**
     * 选择文件
     * @param {*} data
     */
    handleChangeMedia (data) {
      this.model.mediaList = data.list
      this.model.type = data.type
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
        profileId: model.profileId,
        userType: model.userType,
        guideIds: model.guideIds
      }
    },
    /**
     * 格式化渲染数据
     * @param {*} model
     */
    formatLoadData (model) {
      const type = model.imgUrl ? 'img' : 'video'
      console.log({
        ...this.formatCommonData(model),
        mediaList: type === 'img' ? model.imgUrl.split(',') : [model.videoUrl],
        type: type
      })
      return {
        ...this.formatCommonData(model),
        mediaList: type === 'img' ? model.imgUrl.split(',') : [model.videoUrl],
        type: type
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
    /**
     * 关闭/开启选择朋友圈弹框
     */
    handleChangeVisible (visible) {
      this.visible = visible
    },
    /**
     * 选择朋友圈
     */
    handleSureProfileId () {
      this.styleData = this.$refs.friendList.checked
      this.model.profileId = this.styleData.id
      this.handleChangeVisible(false)
    },
    /**
     * 删除朋友圈
     */
    handleDelectProfileId () {
      this.styleData = {}
      this.model.profileId = ''
      this.$refs.friendList.checked = {}
    },
    /**
     * 校验数据
     */
    handleSave () {
      this.onSubmit(this.formatSaveData(this.model))
    },
    /**
     * 返回列表
     */
    handleCancel () {
      this.$router.push({
        path: '/Marketing/FriendsCircle/List'
      })
    },
    /**
     * 提交列表
     * @param {*} model
     */
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
