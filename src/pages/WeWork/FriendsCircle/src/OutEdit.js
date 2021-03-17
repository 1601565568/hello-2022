import { getErrorMsg } from '@/utils/toast'
import design from '../images/design.png'
import friends from '../images/friends.png'
import media from '../images/media.png'
import shili from '../images/shili.png'

export default {
  data () {
    return {
      model: {
        name: '',
        webTitle: '',
        style: 0 // 点击跳转类型0.朋友圈样式  1.设计师样式  2.多媒体样式
      },
      rules: {},
      btnLoad: false,
      isEdit: false,
      linkData: [
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
  methods: {
    /**
     * 初始化
     */
    init () {
      const { id } = this.$route.query
      if (id) {
        this.isEdit = true
        this.$http.fetch(this.$api.weWork.friendsCircle.profileFindById, { id }).then((res) => {
          if (res.success) {
            const { result } = res
            this.model = {
              name: result.name,
              webTitle: result.web_title,
              style: result.style,
              id: result.id
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
    handleSave () {
      this.onSubmit(this.model)
    },
    handleCancel () {
      this.$router.push({
        path: '/Marketing/FriendsCircle/OutList'
      })
    },
    onSubmit (model) {
      this.btnLoad = true
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
