import { getErrorMsg } from '@/utils/toast'
import redpacketEdit from '../../mixins/redpacketEdit'
export default {
  mixins: [redpacketEdit],
  data () {
    const validateLength = (length, rule, value, callback) => {
      if (value.length > length) {
        callback(new Error(`长度在1-${length}字符`))
      } else {
        callback()
      }
    }
    return {
      model: {
        name: '', // 封面名称
        background: '' // 封面海报
      },
      btnLoad: false,
      rules: {
        name: [
          { required: true, message: '请输入封面名称', trigger: ['blur', 'change'] },
          // { min: 1, max: 10, message: '长度在1-10个字符', trigger: ['blur', 'change'] },
          { validator: validateLength.bind(this, 10), trigger: ['blur', 'change'] }
        ],
        background: [
          { required: true, message: '请选择红包背景图', trigger: ['blur', 'change'] }
        ]
      },
      listPath: '/Social/SocialOperation/RedPacket/Poster/List'
    }
  },
  computed: {
    submitApi () {
      const { id } = this.$route.query
      return id ? this.$api.guide.redpacket.setCover(id) : this.$api.guide.redpacket.createCover
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
    formatData (obj) {
      return {
        name: obj.name,
        background: obj.background
      }
    },
    /**
     * 下载
     */
    handleDownload () {
      window.open('https://shopguide.oss-cn-hangzhou.aliyuncs.com/%E6%9C%8B%E5%8F%8B%E5%9C%88/202101/10000146/%E7%BA%A2%E5%8C%85%E5%B0%81%E9%9D%A2%E8%AE%BE%E8%AE%A1%E8%A7%84%E8%8C%83.zip')
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    'model.background' () {
      this.$refs.imgItem && this.$refs.imgItem.clearValidate()
    }
  }
}
