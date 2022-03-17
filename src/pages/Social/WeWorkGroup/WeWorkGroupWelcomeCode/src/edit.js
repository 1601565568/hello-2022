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
      detail: {},
      list: [{}, {}],
      title: '',
      pitContent: '',
      isEdit: false,
      disabled: false
    }
  },
  computed: {
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
    // 获取返回附件列表
    proviewList (val) {
      // console.log(val, '附件列表')
      const arrayItem = val.length ? val[0] : {}
      this.list.splice(1, 1, arrayItem)
    },
    // 获取返回富文本
    proviewPitContent (val) {
      this.pitContent = val
      let obj = {
        type: 0,
        content: {
          type: 'text',
          textContent: val
        }
      }
      if (!val) {
        obj = {}
      }
      this.list.splice(0, 1, obj)
    },
    // 返回群欢迎语列表
    gotoList () {
      this.$router.push({ name: 'WeWorkGroupWelcomeCode' })
    },
    getDetail (id) {
      if (id || id === 0) {
        this.$http.fetch(this.$api.weWork.groupWelcomeCode.getByUUID, { uuid: id }).then(resp => {
          this.detail = resp.result || {}
        }).catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      }
    }
  },
  mounted () {
    let { type, id } = this.$route.query
    this.type = type
    if (type === 'edit') {
      this.isEdit = true
      this.getDetail(id)
    } else if (type === 'look') {
      this.disabled = true
      this.getDetail(id)
    }
  }
}
