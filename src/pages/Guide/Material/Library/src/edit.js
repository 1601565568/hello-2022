import imageform from '../components/ImageForm'
import videoform from '../components/VideoForm'
import articleform from '../components/ArticleForm'
import LabelAdd from '../components/LabelAdd'
import Preview from '../components/Preview'
import { getErrorMsg } from '@/utils/toast'

export default {
  components: { imageform, videoform, articleform, LabelAdd, Preview },
  data: function () {
    return {
      tabValue: '1',
      tabList: [
        { label: '图文素材', name: '1', type: 'imageform' },
        { label: '视频素材', name: '2', type: 'videoform' },
        { label: '文章素材', name: '0', type: 'articleform' }
      ],
      detail: {},
      breadcrumb: [],
      labelList: []
    }
  },
  methods: {
    handleTabChange (targetName, action) {},
    toggleLabel () {
      this.$refs.labelAdd.show()
    },
    togglePreview (current, list, type) {
      this.$refs.preview.toggleShow(current, list, type)
    },
    getLabelList () {
      this.$http
        .fetch(this.$api.guide.materialGroudListAll, {})
        .then(resp => {
          this.labelList = resp.result
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    getDetail (id) {
      if (id || id === 0) {
        this.$http.fetch(this.$api.guide.queryMaterial, { id }).then(resp => {
          this.detail = resp.result || {}
          this.detail.textContent = this.detail.textContentStr
          if (this.detail.subdivisionId === -1) {
            this.detail.subdivisionId = null
          }
        }).catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      }
    }
  },
  created () {
    let { breadcrumb } = this.$route.params
    let { mType = '1', id } = this.$route.query
    let tabObj = this.tabList.find(o => o.name === `${mType}`)
    this.tabValue = tabObj ? tabObj.name : '1'
    this.breadcrumb = breadcrumb || []
    this.getLabelList()
    this.getDetail(id)
  }
}
