import { getErrorMsg } from '@/utils/toast'
export default {
  data () {
    return {
      model: {
        title: '',
        content: '',
        id: null,
        // 小程序招募背景图
        recruitingPostersImage: '',
        // 封面图
        picture: '',
        // 注册页面配置
        rgBackground: '', // 注册页面背景图片
        rgButtonColor: '', // 注册页面按钮颜色
        rgButtonText: '', // 注册页面按钮文案
        rgButtonTextColor: '', // 按钮文案颜色
        rgPrivacyPolicyUrl: '', // 隐私政策上传
        rgPrivacyPolicyName: '', // 隐私政策文件名
        policyList: [], // 隐私政策聚合数组
        rgMemberRuleUrl: '', // 会员规则上传
        rgMemberRuleName: '', // 会员规则文件名
        ruleList: [], // 会员规则聚合数组
        rgOtherProtocol: [], // 其他协议集合
        mpFollowState: 0, // 会员招募>跳转关注公众号>是否关注公众号：状态 0不关注 1关注
        mpFollowBackground: '', // 会员招募>跳转关注公众号>结果页>背景图片
        mpFollowQrcodeSize: 0, // 会员招募>跳转关注公众号>结果页>二维码大小
        mpFollowQrcodeX: 0, // 会员招募>跳转关注公众号>结果页>二维码X坐标
        mpFollowQrcodeY: 0 // 会员招募>跳转关注公众号>结果页>二维码Y坐标
      },
      rules: {
        title: [
          { required: true, message: '请输入标题名称', trigger: ['blur', 'change'] },
          { min: 1, max: 20, message: '长度在1-20个字符以内', trigger: ['blur', 'change'] }
        ],
        content: [
          { required: true, message: '请输入摘要内容', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '长度在1-50个字符以内', trigger: ['blur', 'change'] }
        ],
        picture: [
          { required: true, message: '请上传封面图', trigger: ['blur', 'change'] }
        ],
        recruitingPostersImage: [
          { required: true, message: '请上传导购招募海报背景图', trigger: ['blur', 'change'] }
        ],
        mpFollowBackground: [
          { required: true, message: '请上传引导关注公众号页背景图', trigger: ['blur', 'change'] }
        ],
        // 注册页面配置
        rgBackground: [
          { required: true, message: '请上传注册页面背景图', trigger: ['blur', 'change'] }
        ],
        rgButtonColor: [
          { required: true, message: '请选择按钮颜色', trigger: ['blur', 'change'] }
        ],
        rgButtonText: [
          { required: true, message: '请输入按钮文案', trigger: ['blur', 'change'] },
          { min: 1, max: 10, message: '长度在1-10个字符以内', trigger: ['blur', 'change'] }
        ],
        rgButtonTextColor: [
          { required: true, message: '请选择按钮文案颜色', trigger: ['blur', 'change'] }
        ],
        rgPrivacyPolicyUrl: [
          { required: true, message: '请上传隐私政策', trigger: ['blur', 'change'] }
        ],
        rgMemberRuleUrl: [
          { required: true, message: '请上传会员规则', trigger: ['blur', 'change'] }
        ]
      },
      btnLoad: false,
      defaultImg: 'https://shopguide.oss-cn-hangzhou.aliyuncs.com/system/19EA3131-0D46-40C3-95FE-D9C4FD6AEA51.png'
    }
  },
  methods: {
    async init () {
      const result = await this.loadData()
      if (result) {
        this.model = this.formatLoadData(result)
        if (!Array.isArray(this.model.rgOtherProtocol)) {
          Object.assign(this.model, {
            rgOtherProtocol: JSON.parse(this.model.rgOtherProtocol) || []
          })
        }
      }
    },
    async loadData () {
      const result = await this.$http.fetch(this.$api.guide.recruitPageConfig.getInfo)
      // const result = { 'success': true, 'result': { mpFollowBackground: 'https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/202001/10000146/51be3d3c-2976-4832-9971-de28239564c7.jpg', 'mpFollowQrcodeSize': 0, 'create_time': '2020-04-29 10:09:25', 'recruitingPostersImage': 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/guide/1/img/common/app/Group.png', 'title': '领会员卡享专属权益', 'mpFollowQrcodeY': 0, 'content': 'Dear，点击立享专属会员服务哦', 'picture': 'https://hb3-ecrmmall.oss-cn-zhangjiakou.aliyuncs.com/GUIDE_QRCODE/WECHAT/appletCard.png', 'mpFollowQrcodeX': 0, 'mpFollowState': 0, 'update_time': '2020-08-12 10:56:48', 'group_id': '10000146', 'id': '61', 'state': 1 } }
      if (result.success) {
        return result.result
      } else {
        return false
      }
    },
    // 恢复默认背景图
    restoreDef () {
      const img = 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/%E8%83%8C%E6%99%AF%E5%9B%BE%E5%A4%87%E4%BB%BD.png'
      this.model.rgBackground = img
    },
    formatLoadData (result) {
      const { id, companyLogo, title,
        content, recruitingPostersImage,
        picture, mpFollowQrcodeSize, mpFollowQrcodeX,
        mpFollowQrcodeY, mpFollowState, mpFollowBackground,
        rgBackground, rgButtonColor, rgButtonTextColor,
        rgButtonText, rgPrivacyPolicyUrl, rgPrivacyPolicyName, rgMemberRuleUrl, rgMemberRuleName, rgOtherProtocol } = result
      return {
        id: id,
        title: title,
        content: content,
        companyLogo: companyLogo,
        // 小程序招募背景图
        recruitingPostersImage: recruitingPostersImage,
        // 封面图
        picture: picture,
        // 默认注册页面背景图
        rgBackground: rgBackground,
        // 按钮颜色
        rgButtonColor: rgButtonColor,
        // 按钮文案颜色
        rgButtonTextColor: rgButtonTextColor,
        // 按钮文本
        rgButtonText: rgButtonText,
        // 隐私政策上传
        rgPrivacyPolicyUrl: rgPrivacyPolicyUrl,
        rgPrivacyPolicyName: rgPrivacyPolicyName,
        policyList: [{ name: rgPrivacyPolicyName, url: rgPrivacyPolicyUrl }],
        // 会员规则上传
        rgMemberRuleUrl: rgMemberRuleUrl,
        rgMemberRuleName: rgMemberRuleName,
        ruleList: [{ name: rgMemberRuleName, url: rgMemberRuleUrl }],
        // 其他协议上传集合
        rgOtherProtocol: JSON.parse(rgOtherProtocol) || [],
        mpFollowState: mpFollowState, // 会员招募>跳转关注公众号>是否关注公众号：状态 0不关注 1关注
        mpFollowBackground: mpFollowBackground, // 会员招募>跳转关注公众号>结果页>背景图片
        mpFollowQrcodeSize: mpFollowQrcodeSize, // 会员招募>跳转关注公众号>结果页>二维码大小
        mpFollowQrcodeX: mpFollowQrcodeX, // 会员招募>跳转关注公众号>结果页>二维码X坐标
        mpFollowQrcodeY: mpFollowQrcodeY // 会员招募>跳转关注公众号>结果页>二维码Y坐标
      }
    },
    onDragResize (params) {
      this.model = { ...this.model,
        mpFollowQrcodeSize: params.width,
        mpFollowQrcodeX: params.left,
        mpFollowQrcodeY: params.top
      }
    },
    update () {
      this.loading = true
      this.$refs.searchform.validate(valid => {
        if (valid) {
          this.doUpdate()
        }
      })
    },
    // 隐私政策上传成功
    rgPrivacyPolicySuccess (list) {
      this.model.rgPrivacyPolicyName = list[0].name
      this.model.rgPrivacyPolicyUrl = list[0].url
      this.$refs.searchform.validateField('rgPrivacyPolicyUrl')
    },
    // 会员规则上传成功
    rgMemberRuleSuccess (list) {
      this.model.rgMemberRuleName = list[0].name
      this.model.rgMemberRuleUrl = list[0].url
      this.$refs.searchform.validateField('rgMemberRuleUrl')
    },
    // 隐私政策删除成功
    rgPrivacyPolicyOnRemove (list) {
      this.model.rgPrivacyPolicyName = ''
      this.model.rgPrivacyPolicyUrl = ''
      this.$refs.searchform.validateField('rgPrivacyPolicyUrl')
    },
    // 会员规则删除成功
    rgMemberRuleOnRemove (list) {
      this.model.rgMemberRuleName = ''
      this.model.rgMemberRuleUrl = ''
      this.$refs.searchform.validateField('rgMemberRuleUrl')
    },
    // 其他规则上传成功
    rgOtherProtocolSuccess (list) {
      // let array = []
      // list.forEach(item => {
      //   array.push({name: item.name, value: item.url})
      // })
      // array.reduce()
      this.model.rgOtherProtocol = list
    },
    // 其他规则删除成功
    rgOtherProtocolRemove (list) {
      this.model.rgOtherProtocol = list
    },
    doUpdate () {
      this.model.rgOtherProtocol.forEach(item => {
        item.value = item.url
      })
      let obj = { ...this.model }
      obj.rgOtherProtocol = JSON.stringify(obj.rgOtherProtocol)
      this.btnLoad = true
      this.$http.fetch(this.$api.guide.recruitPageConfig.updateSet, obj).then(() => {
        this.btnLoad = false
        this.$notify.success('修改成功')
      }).catch((resp) => {
        this.btnLoad = true
        this.$notify.error(getErrorMsg('修改失败', resp))
      })
    }
  },
  mounted () {
    this.init()
  }
}
