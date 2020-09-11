import { getErrorMsg } from '@/utils/toast'
import apiRequestConfirm from '@nascent/ecrp-ecrm/src/utils/apiRequestConfirm'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import NsChatRoomDialog from '@/components/NsChatRoomDialog'

export default {
  name: 'groupConfig',
  mixins: [tableMixin, scrollHeight],
  components: { NsChatRoomDialog },
  data: function () {
    let defModel = {
      autoCreateRoom: 1,
      checkedChatRoom: []
    }
    return {
      model: defModel,
      title: '新建群聚合码',
      configId: ''
    }
  },
  created: function () {
    this.configId = this.$route.params.configId
    if (this.configId) {
      this.title = '编辑群聚合码'
      this.findDetail()
    } else {
      this.title = '新建群聚合码'
    }
  },
  methods: {
    // 加载详情
    async findDetail () {
      this.loading = true
      await this.$http
        .fetch(this.$api.guide.chatRoomConfig.chatRoomGroupGetByConfigId, { configId: this.configId })
        .then(resp => {
          this.model = resp.result
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询配置失败', resp))
        })
      this.loading = false
    },
    // submit
    onSave () {
      this.loading = true
      this.$http
        .fetch(this.$api.guide.chatRoomConfig.chatRoomGroupCreate, this.model)
        .then(resp => {
          this.$notify.success('成功')
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询配置失败', resp))
        })
      this.loading = false
    },
    cancel () {
      this.searchObj.start = 0
      this.searchObj.searchMap = {}
    },
    handleDelete (row) {
      this.data = row
    }
  }
}
