import sohot from '@/assets/sohot.png'
import nothot from '@/assets/nothot.png'

export default {
  data () {
    const validateContent = (length, rule, value, callback) => {
      if (length > 1000) {
        callback(new Error(`内容最多1000个字`))
      } else {
        callback()
      }
    }
    const validateMediaList = (rule, value, callback) => {
      if (!value || value.length < 1) {
        callback(new Error(`请选择附件`))
      } else {
        callback()
      }
    }
    const validateGuideIds = (rule, value, callback) => {
      if (!value || value.length < 1) {
        callback(new Error(`请选择员工`))
      } else {
        callback()
      }
    }
    return {
      tools: [
        { type: 'tag', text: '插入企业微信员工姓名', id: 'WX_EMPLOYEE_NAME', value: '企业微信员工姓名', icon: 'icon-xingming-2-x' },
        // { type: 'tag', text: '插入客户微信昵称', id: '2', value: '客户微信昵称',icon:'icon-nicheng2x' },
        { type: 'tag', text: '插入企业微信员工门店', id: 'WX_SHOP_NAME', value: '企业微信员工门店', icon: 'icon-mendian-2-x' }
      ],
      model: { // 提交信息
        content: '',
        hotLevel: 0, // 好感度
        profileId: '', // 对外信息展示
        userType: 0, // 0 全部员工  1 部分员工
        mediaList: [], // 媒体列表
        type: '', // 类型img 图片 video 视频
        videoTopUrl: '', // 封面图
        guideIds: []
      },
      styleData: {}, // 样式信息
      rules: {
        mediaList: [
          { required: true, message: '请选择附件', trigger: ['blur', 'change'] },
          { validator: validateMediaList, trigger: ['blur', 'change'] }
        ],
        profileId: [
          { required: true, message: '请选择对外信息说明', trigger: ['blur', 'change'] }
        ],
        userType: [
          { required: true, message: '请选择员工', trigger: ['blur', 'change'] }
        ],
        guideIds: [
          { required: true, message: '请选择员工', trigger: ['blur', 'change'] },
          { validator: validateGuideIds, trigger: ['blur', 'change'] }
        ]
      },
      btnLoad: false,
      isEdit: false,
      visible: false,
      activityIntroductionLength: 0,
      validateContent,
      sohot,
      nothot
    }
  },
  computed: {
    textConTent () {
      if (this.$refs.testText) {
        return this.$refs.testText.htmlToText(this.model.content)
      }
      return ''
    },
    title () {
      return this.isEdit ? '对外信息展示详情' : '新建对外信息展示'
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
            this.styleData = this.formatStyleData(result.weWorkExternalProfile)
            this.type = result.imgUrl ? 'img' : 'video'
          }
        })
      }
    },

    inputLength (length) {
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
      this.model.videoTopUrl = data.poster
    },
    /**
     * 格式化通用数据
     * @param {*} model
     */
    formatCommonData (model) {
      return {
        content: model.content,
        hotLevel: model.hotLevel,
        profileId: model.profileId,
        userType: model.userType,
        videoTopUrl: model.videoTopUrl
      }
    },

    /**
     * 格式化样式数据
     * @param {*} model
     */
    formatStyleData (model) {
      return {
        id: model.id,
        name: model.name,
        operateName: model.operate_name,
        status: model.state,
        style: model.style,
        webTitle: model.web_title,
        signature: model.signature,
        topImgUrl: model.top_img_url
      }
    },
    /**
     * 格式化渲染数据
     * @param {*} model
     */
    formatLoadData (model) {
      const type = model.imgUrl ? 'img' : 'video'
      if (!this.$refs.testText) {
        setTimeout(() => {
          this.model.content = this.$refs.testText.stringTohtml(model.content)
        }, 500)
      }
      return {
        ...this.formatCommonData(model),
        mediaList: type === 'img' ? model.imgUrl.split(',') : [model.videoUrl],
        guideIds: model.guideIds,
        type: type,
        content: this.$refs.testText ? this.$refs.testText.stringTohtml(model.content) : ''
      }
    },
    /**
     * 格式化请求数据
     * @param {*} model
     */
    formatSaveData (model) {
      const type = model.type
      return {
        ...this.formatCommonData(model),
        imgUrl: type === 'img' ? model.mediaList.join(',') : '',
        videoUrl: type === 'video' ? model.mediaList[0] : '',
        guideIds: model.guideIds.map(item => item.id),
        content: this.$refs.testText.htmlToString(model.content)
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
      this.btnLoad = true
      this.$refs.searchform.validate(valid => {
        if (valid) {
          this.onSubmit(this.formatSaveData(this.model))
        } else {
          this.btnLoad = false
        }
      })
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
