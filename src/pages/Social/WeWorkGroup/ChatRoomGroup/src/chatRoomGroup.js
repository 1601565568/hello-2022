import { getErrorMsg } from '@/utils/toast'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsChatRoomDialog from '@/components/NsChatRoomDialog'
import ElInputNumber from '@nascent/nui/lib/input-number'

export default {
  name: 'groupConfig',
  mixins: [tableMixin],
  components: { NsChatRoomDialog, ElInputNumber },
  data: function () {
    let defModel = {
      autoCreateRoom: 1,
      roomBaseId: 1,
      checkedChatRoom: []
    }
    return {
      isWhiteList: false,
      loading: false,
      model: defModel,
      title: '新建群聚合码',
      configId: ''
    }
  },
  mounted () {
    this.checkWhiteList()

    this.configId = this.$route.query.configId
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
          resp.result.checkedChatRoom.forEach(data => {
            data.workShopName = data.workShopName.join(',')
          })
          this.model = resp.result
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询配置失败', resp))
        })
      this.loading = false
    },
    onSave () {
      if (!this.model.remark) {
        this.$notify.error('请填写标题')
        return
      }
      // if (this.model.checkedChatRoom.length < 1) {
      //   this.$notify.error('请选择至少一个群')
      //   return
      // }
      this.loading = true
      let chatIds = []
      this.model.checkedChatRoom.forEach(item => {
        chatIds.push(item.chatId)
      })
      this.model.chatIdList = chatIds
      if (this.configId) {
        this.model.configId = this.configId
      }
      this.$http
        .fetch(this.$api.guide.chatRoomConfig.chatRoomGroupCreate, this.model)
        .then(resp => {
          this.$notify.success('成功')
          this.$router.push({ name: 'chatRoomGroup' })
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('保存失败:', resp))
        }).finally(() => {
          this.loading = false
        })
    },
    cancel () {
      this.$router.push({ name: 'chatRoomGroup' })
    },
    handleDelete (scope) {
      this.model.checkedChatRoom.splice(scope.$index, 1)
    },
    // 组件得数据
    getChatRoomData (selectChatRoomData) {
      let data = selectChatRoomData
      this.model.checkedChatRoom = data
    },
    // 是否有白名单
    async checkWhiteList () {
      try {
        const resp = await this.$http.fetch(this.$api.guide.chatRoomConfig.isWhiteList)
        if (resp.success) {
          this.isWhiteList = !!resp.result
        }
      } catch (error) {
        this.$notify.error('是否是白名单获取失败')
      }
    }
  }
}
