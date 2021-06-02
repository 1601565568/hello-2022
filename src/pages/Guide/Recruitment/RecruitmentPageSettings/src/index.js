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
        registerPostersImage: '', // 注册页面背景图片
        registerColor: '', // 注册页面按钮颜色
        registerText: '', // 注册页面按钮文案
        registerTxtColor: '', // 按钮文案颜色
        registerConceal: '', // 隐私政策上传
        registerRule: '', // 会员规则上传
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
        registerPostersImage: [
          { required: true, message: '请上传注册页面背景图', trigger: ['blur', 'change'] }
        ],
        registerColor: [
          { required: true, message: '请选择按钮颜色', trigger: ['blur', 'change'] }
        ],
        registerText: [
          { required: true, message: '请输入按钮文案', trigger: ['blur', 'change'] },
          { min: 1, max: 10, message: '长度在1-10个字符以内', trigger: ['blur', 'change'] }
        ],
        registerTxtColor: [
          { required: true, message: '请选择按钮文案颜色', trigger: ['blur', 'change'] }
        ],
        registerConceal: [
          { required: true, message: '请上传隐私政策', trigger: ['blur', 'change'] }
        ],
        registerRule: [
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
        // 按钮颜色
        registerColor: '#000000',
        // 按钮文案颜色
        registerTxtColor: '#fff',
        registerText: '注册入会',
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
      console.log(this.model, 9999)
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
