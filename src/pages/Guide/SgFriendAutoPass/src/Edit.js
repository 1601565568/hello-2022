import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
import moment from 'moment'

export default {
  name: 'index',
  mixins: [tableMixin],
  data: function () {
    let that = this
    return {
      friendAutoPass: {
        id: null,
        account: null,
        name: null,
        wxaccount: null,
        wxnick: null,
        wxid: null,
        isopen: 1,
        beginTime: null,
        endTime: '',
        mininterval: 60,
        maxinterval: 180,
        isvalidate: 1,
        validatemsg: null,
        matchmode: 1,
        joinqueue: 1
      },
      guideIds: [],
      isShowWxAccount: true,
      ids: null,
      timeValue: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      names: null,
      title: '好友自动通过编辑',
      parameter: {
        length: 10,
        searchMap: {},
        start: 0
      },
      modelObj: {},
      status: 0,
      rules: {
        'code': [{ required: true, message: '请输入配置项编码' }],
        'value': [{ required: true, message: '请输入配置项值' }],
        'type': [{ required: true, message: '请选择类型' }]
      }
    }
  },
  mounted: function () {
    const ids = this.$route.params.id
    this.ids = ids
    if (this.ids === '0') {
      return
    }
    // 批量编辑
    this.$http.fetch(this.$api.guide.autoPass.findByIds, {
      id: ids
    }).then(data => {
      if (data.result.length <= 1) {
        this.friendAutoPass.id = data.result[0].id
        this.names = data.result[0].name
        this.friendAutoPass.wxaccount = data.result[0].wxaccount
        this.friendAutoPass.wxnick = data.result[0].wxnick
        this.friendAutoPass.mininterval = data.result[0].mininterval
        this.friendAutoPass.maxinterval = data.result[0].maxinterval
        this.friendAutoPass.isvalidate = data.result[0].isvalidate
        this.friendAutoPass.validatemsg = data.result[0].validatemsg
        this.friendAutoPass.matchmode = data.result[0].matchmode
        this.friendAutoPass.isopen = data.result[0].isopen
        this.friendAutoPass.beginTime = data.result[0].begin_time
        this.friendAutoPass.endTime = data.result[0].end_time
        this.friendAutoPass.joinqueue = data.result[0].joinqueue
        this.timeValue = []
        this.timeValue.push(new Date(`2016-01-01 ${data.result[0].begin_time}`))
        this.timeValue.push(new Date(`2016-01-02 ${data.result[0].end_time}`))
      } else {
        this.names = ''
        this.isShowWxAccount = false
        var chooseName = []
        data.result.forEach((item) => {
          chooseName.push(item.name)
        })
        this.names = chooseName.join(',')
      }
    }).catch((error) => {
      this.$notify.error(getErrorMsg('加载好友自动通过信息失败：', error))
    }).finally(() => {
      this.loading = false
    })
  },
  methods: {
    onSave (model) { // 编辑保存
      let that = this
      var time = []
      if (that.timeValue) {
        let begin = moment(this.timeValue[0]).format('HH:mm:ss')
        let end = moment(this.timeValue[1]).format('HH:mm:ss')
        time.push(begin)
        time.push(end)
      } else {
        time.push('00:00:00')
        time.push('23:59:59')
      }
      if (!that.friendAutoPass.mininterval || !that.friendAutoPass.maxinterval) {
        this.$message.error('通过时间间隔不能为空')
        return
      }
      if (that.friendAutoPass.mininterval >= 3600 || that.friendAutoPass.mininterval < 20 ||
        that.friendAutoPass.maxinterval >= 3600 || that.friendAutoPass.maxinterval < 20) {
        return this.$message.error('通过时间间隔范围20-3600')
      }
      if (that.friendAutoPass.mininterval >= that.friendAutoPass.maxinterval) {
        return this.$message.error('通过时间间隔最小间隔不能大于最大间隔')
      }
      if (that.ids === '0' && that.guideIds.length < 1) {
        return this.$message.error('请选择员工')
      }
      that.$http.fetch(that.$api.guide.autoPass.update, {
        sgFriendAutoPass: model,
        ids: this.ids,
        guides: this.guideIds,
        timeValue: time
      }).then(() => {
        that.$notify.success('保存成功')
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('保存失败', resp))
      }).finally(() => {
        that.$router.push({ path: '/Guide/SgFriendAutoPass/List' })
      })
    },
    onCancel () { // 取消
      let that = this
      that.$router.push({ path: '/Guide/SgFriendAutoPass/List' })
    }
  }
}
