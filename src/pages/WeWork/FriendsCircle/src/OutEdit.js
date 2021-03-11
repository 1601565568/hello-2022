import design from '../images/design.png'
import friends from '../images/friends.png'
import media from '../images/media.png'
import shili from '../images/shili.png'

export default {
  data () {
    return {
      model: {
        name: '',
        webName: '',
        linkType: 1 // 点击跳转类型1.朋友圈样式  2.设计师样式  3.多媒体样式
      },
      linkData: [
        {
          type: 1,
          img: friends,
          title: '朋友圈样式'
        },
        {
          type: 2,
          img: design,
          title: '设计师样式'
        },
        {
          type: 3,
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
     * 切换链接类型
     * @param {*} type
     */
    handleChangeType (type) {
      this.model.linkType = type
    },
    /**
     * 查看/关闭 示例
     * @param {boolean} previewVisin
     * @param {number} type
     */
    handlePreview (previewVisin, type) {
      this.previewVisin = previewVisin
    }
  }
}
