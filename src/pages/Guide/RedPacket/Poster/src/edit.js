import { getErrorMsg } from '@/utils/toast'
export default {
  data () {
    return {
      model: {
        name: '', // 封面名称
        background: '' // 封面海报
      },
      btnLoad: false,
      rules: {
        name: [
          { required: true, message: '请输入封面名称', trigger: ['blur', 'change'] },
          { min: 1, max: 10, message: '长度在1-10个字符', trigger: ['blur', 'change'] }
        ],
        background: [
          { required: true, message: '请选择红包背景图', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init () {
      const { id } = this.$route.query
      if (id) {
        this.$http.fetch(this.$api.guide.redpacket.getCoverDetail(id)).then((res) => {
          if (res.success) {
            const { result } = res
            this.model = {
              name: result.name,
              background: result.background
            }
          }
        }).catch((resp) => {
          this.$notify.error(getErrorMsg('获取失败', resp))
        })
      }
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
      const { id } = this.$route.query
      const url = id ? this.$api.guide.redpacket.setCover(id) : this.$api.guide.redpacket.createCover
      this.$http.fetch(url, this.model).then(() => {
        this.btnLoad = false
        this.$notify.success('保存成功')
        this.handleCancel()
      }).catch((resp) => {
        this.btnLoad = false
        this.$notify.error(getErrorMsg('保存失败', resp))
      })
    },
    // 返回列表
    handleCancel () {
      this.$router.push({ path: '/Social/SocialOperation/RedPacket/Poster/List' })
    },
    handleDownload () {
      window.open('https://shopguide.oss-cn-hangzhou.aliyuncs.com/%E6%9C%8B%E5%8F%8B%E5%9C%88/202101/10000146/%E7%BA%A2%E5%8C%85%E5%B0%81%E9%9D%A2%E8%AE%BE%E8%AE%A1%E8%A7%84%E8%8C%83.zip')
    }
  },
  mounted () {
    this.init()
  }
}
