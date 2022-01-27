import PageEdit from '@/components/NewUi/PageEdit'
import SimpleCollapse from '@/components/NewUi/SimpleCollapse'
import PhoneBox from '@/components/NewUi/PhoneBox'
import SourceAll from '../components/SourceAll'
import Preview from '@/components/NsPreview'
import { getErrorMsg } from '@/utils/toast'
import MessagePreviewPanel from '@/pages/WeWork/SOP/components/MessagePreviewPanel/index.vue'

export default {
  components: { Preview, PageEdit, PhoneBox, SourceAll, SimpleCollapse, MessagePreviewPanel },
  data: function () {
    return {
      tabValue: '1',
      // tabList: [
      //   { label: '图文素材', name: '1', type: 'imageform' },
      //   { label: '视频素材', name: '2', type: 'videoform' },
      //   { label: '文章素材', name: '0', type: 'articleform' }
      // ],
      detail: {},
      breadcrumb: [],
      list: [{}, {}],
      title: '',
      subdivision: false,
      pitContent: '',
      labelList: [],
      isEdit: false
    }
  },
  computed: {
    // messageList () {
    //   if (this.model.content) {
    //     return [ this.welcomeMessage, ...this.model.annexList ]
    //   } else {
    //     return this.model.annexList
    //   }
    // }
  },
  methods: {
    // 保存
    onSave () {
      this.$refs.sourceAll.onSave()
    },
    // 取消
    onBack () {
      this.$refs.sourceAll.onBack()
    },
    proviewList (val) {
      console.log(val, '获得列表')
      this.list.splice(1, 1, val)
      // this.list[1] = val
    },
    proviewTitle (val) {
      this.title = val
    },
    proviewSubdivision (val) {
      this.subdivision = val
    },
    proviewPitContent (val) {
      this.pitContent = val
      const obj = {
        type: 0,
        content: {
          type: 'text',
          textContent: val
        }
      }
      this.list.splice(0, 1, obj)
    },
    gotoList (catalogue) {
      const { breadcrumb, listMode } = this.$route.params
      this.$router.push({ name: 'LibraryList', params: { breadcrumb: catalogue || breadcrumb, listMode } })
    },
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
        this.isEdit = true
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
    // let tabObj = this.tabList.find(o => o.name === `${mType}`)
    // this.tabValue = tabObj ? tabObj.name : '1'
    this.breadcrumb = breadcrumb ? JSON.parse(JSON.stringify(breadcrumb)) : []
    this.getLabelList()
    this.getDetail(id)
  }
}
