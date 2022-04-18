import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
export default {
  data () {
    return {
      previewVisin: false, // 弹框状态
      previewType: 1, // 弹框展示内容 1 配置说明 2 对外信息展示 说明
      url: this.$api.weWork.friendsCircle.profileList,
      styleList: { // 样式枚举
        0: '朋友圈样式',
        1: '设计师样式',
        2: '多媒体样式'
      },
      statusList: { // 状态枚举
        0: '正常', 1: '同步中', 2: '匹配异常'
      },
      delectingIds: [], // 正在删除中的id
      tabId: null
    }
  },
  mixins: [tableMixin],
  methods: {
    /**
     * 查看/关闭 配置说明
     * @param {*} previewVisin
     */
    handlePreview (previewVisin, previewType) {
      this.previewType = previewType
      this.previewVisin = previewVisin
    },
    /**
     * 去企微
     */
    handleQY () {
      window.open('https://work.weixin.qq.com/wework_admin/loginpage_wx?redirect_uri=https://work.weixin.qq.com/wework_admin/frame#profile/contactsMng/exMemberAttrVisable')
    },
    /**
     * 删除
     * @param {number} id
     */
    handleDelect (id) {
      this.$confirm('删除后，网页中的内容将被清空，是否确认删除？', '提示信息', {
        confirmButtonText: '确定',
        type: 'warning',
        cancelButtonText: '取消'
      }).then(() => {
        this.requestDelect(id)
      })
    },
    /**
     * 请求删除
     * @param {number} id
     */
    requestDelect (id) {
      this.delectingIds.push(id)
      this.$http.fetch(this.$api.weWork.friendsCircle.profileDelById, { id }).then(() => {
        this.$notify.success('删除成功')
        this.$searchAction$()
      }).catch((resp) => {
        this.$notify.error(getErrorMsg('删除失败', resp))
        const index = this.delectingIds.findIndex(item => item.id === id)
        this.delectingIds.split(index, 1)
      })
    },
    /**
     * 同步修改单条状态
     * @param {number} state 需要修改的状态
     * @param {number} index  下标修改状态使用
     */
    changeState (status, index) {
      this.$set(this._data._table.data, index, { ...this._data._table.data[index], status })
    },
    /**
     * 更新
     * @param {number} id
     * @param {number} index  下标修改状态使用
     */
    handleRefresh (id, index) {
      this.changeState(1, index)
      this.$http.fetch(this.$api.weWork.friendsCircle.profileSync, { id }).then((res) => {
        this.changeState(res.result, index)
        this.$notify.success('更新成功')
      }).catch((resp) => {
        this.$notify.error(getErrorMsg('更新失败', resp))
      })
    },
    /**
     * 编辑/新建
     * @param {number｜null} id
     */
    handleDetail (id) {
      const query = id ? { id } : {}
      this.$router.push({
        path: '/Marketing/FriendsCircle/OutEdit',
        query
      })
    },
    tabSwitchActivityList () { }
  },
  mounted () {
    this.$searchAction$()
  }
}
