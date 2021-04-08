import { getErrorMsg } from '@/utils/toast'
import design from '../images/design.png'
import friends from '../images/friends.png'
import media from '../images/media.png'
import shili from '../images/shili.png'

export default {
  data () {
    const checkName = (maxLength, rule, value, callback) => {
      if (this.calcLength(value) > maxLength) {
        callback(new Error(`最多输入${maxLength}个字符`))
      } else {
        callback()
      }
    }
    return {
      model: {
        name: '',
        webTitle: '',
        style: 0, // 点击跳转类型0.朋友圈样式  1.设计师样式  2.多媒体样式
        signature: '',
        topImgUrl: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入对外信息名称', trigger: ['blur', 'change'] },
          { validator: checkName.bind(this, 8), trigger: ['blur', 'change'] }
        ],
        webTitle: [
          { required: true, message: '请输入网页名称', trigger: ['blur', 'change'] },
          { min: 1, max: 12, message: '最多输入12个字符', trigger: ['blur', 'change'] }
        ],
        style: [
          { required: true, message: '请选择点击跳转内容', trigger: ['blur', 'change'] }
        ],
        topImgUrl: [
          { required: true, message: '请选择朋友圈封面图', trigger: ['blur', 'change'] }
        ],
        signature: [
          { min: 1, max: 30, message: '最多输入30个字符', trigger: ['blur', 'change'] }
        ]
      },
      btnLoad: false,
      isEdit: false,
      linkData: [ // 样式列表
        {
          type: 0,
          img: friends,
          title: '朋友圈样式'
        },
        {
          type: 1,
          img: design,
          title: '设计师样式'
        },
        {
          type: 2,
          img: media,
          title: '多媒体样式'
        }
      ],
      previewVisin: false,
      shili
    }
  },
  computed: {
    textLength () {
      const { name } = this.model
      return this.calcLength(name)
    }
  },
  methods: {
    /**
     * 计算字符
     * @param {string} value
     */
    calcLength (value) {
      const list = value.split('')
      if (list && list.length) {
        return list.reduce((total, item) => {
          if (item.charCodeAt(0) > 127 || item.charCodeAt(0) === 94) {
            return total + 2
          }
          return total + 1
        }, 0)
      }
      return 0
    },
    /**
     * 初始化
     */
    init () {
      const { id } = this.$route.query
      if (id) {
        this.model.style = -1
        this.isEdit = true
        this.$http.fetch(this.$api.weWork.friendsCircle.profileFindById, { id }).then((res) => {
          if (res.success) {
            const { result } = res
            this.model = {
              name: result.name,
              webTitle: result.web_title,
              style: result.style,
              id: result.id,
              signature: result.signature,
              topImgUrl: result.top_img_url
            }
          }
        }).catch((resp) => {
          this.$notify.error(getErrorMsg('加载失败', resp))
        })
      }
    },
    /**
     * 切换链接类型
     * @param {*} type
     */
    handleChangeType (type) {
      this.model.style = type
    },
    /**
     * 查看/关闭 示例
     * @param {boolean} previewVisin
     * @param {number} type
     */
    handlePreview (previewVisin, type) {
      this.previewVisin = previewVisin
    },
    /**
     * 保存校验
     */
    handleSave () {
      this.btnLoad = true
      this.$refs.searchform.validate(valid => {
        if (valid) {
          this.onSubmit(this.model)
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
        path: '/Marketing/FriendsCircle/OutList'
      })
    },
    /**
     * 提交信息
     * @param {*} model
     */
    onSubmit (model) {
      this.$http.fetch(this.$api.weWork.friendsCircle.profileAdd, model).then(() => {
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
