import { getErrorMsg } from '@/utils/toast'
export default {
  data () {
    return {
      model: {
        name: '', // 活动名称
        shopList: [], // 选择门店
        time: [], // 时间
        validTimeType: 1, // 是否永久
        activityPoster: '', // 活动海报
        content: '',
        id: null,
        // 小程序招募背景图
        recruitingPostersImage: '',
        // 封面图
        picture: '',
        mpFollowState: 0, // 会员招募>跳转关注公众号>是否关注公众号：状态 0不关注 1关注
        mpFollowBackground: '', // 会员招募>跳转关注公众号>结果页>背景图片
        mpFollowQrcodeSize: 0, // 会员招募>跳转关注公众号>结果页>二维码大小
        mpFollowQrcodeX: 0, // 会员招募>跳转关注公众号>结果页>二维码X坐标
        mpFollowQrcodeY: 0 // 会员招募>跳转关注公众号>结果页>二维码Y坐标
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: ['blur', 'change'] },
          { min: 1, max: 20, message: '长度在1-20个字符', trigger: ['blur', 'change'] }
        ],
        shopList: [
          { required: true, message: '请选择参加门店', trigger: ['blur', 'change'] }
        ],
        time: [
          { required: true, message: '请选择有效日期', trigger: ['blur', 'change'] }
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
        ]
      },
      btnLoad: false,
      defaultImg: 'https://shopguide.oss-cn-hangzhou.aliyuncs.com/system/19EA3131-0D46-40C3-95FE-D9C4FD6AEA51.png'
    }
  },
  props: {
    type: {
      default: 'Group' // Group:群拉新 Friends:好友拉新
    }
  },
  computed: {
    // 页面名称
    title () {
      const type = this.$route.query && this.$route.query.id ? '编辑' : '新建'
      const path = this.type === 'Group' ? '群' : '好友'
      return `${type}LBS${path}拉新活动`
    }
  },
  methods: {
    async init () {
      const result = await this.loadData()
      if (result) {
        this.model = this.formatLoadData(result)
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
    handleChangeShopList (value) {
      this.model.shopList = value
      this.$refs.ruleForm && this.$refs.ruleForm.validateField('shopList')
    },
    formatLoadData (result) {
      const { id, companyLogo, title, content, recruitingPostersImage, picture, mpFollowQrcodeSize, mpFollowQrcodeX, mpFollowQrcodeY, mpFollowState, mpFollowBackground } = result
      return {
        id: id,
        title: title,
        content: content,
        companyLogo: companyLogo,
        // 小程序招募背景图
        recruitingPostersImage: recruitingPostersImage,
        // 封面图
        picture: picture,
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
    doUpdate () {
      this.btnLoad = true
      this.$http.fetch(this.$api.guide.recruitPageConfig.updateSet, this.model).then(() => {
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
