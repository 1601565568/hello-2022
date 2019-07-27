import tableMixin from 'web-crm/src/mixins/table'
import moment from 'moment'

export default {
  mixins: [tableMixin],
  data() {
    return {
      model: {
        srhDate: [this.getDateFromToday(-30), new Date()],
        wid: null,
        content: null
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            picker.$emit('pick', [this.getDateFromToday(-7), new Date()]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            picker.$emit('pick', [this.getDateFromToday(-30)]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            picker.$emit('pick', [this.getDateFromToday(-90), new Date()]);
          }
        }]
      },
      ownerData: [],
      url: this.$api.guide.wxChat.findTargetList,
      targetList: [],
      currTargetIndex: null,
      currTargetOwnerId: null,
      currTargetOwnerNick: null,
      currTargetWid: null,
      currTargetNick: null,


      dialogVisible: false,
      formInline: {
        user: '',
        region: ''
      },
      value8: '',
      input10: '',
      value2: new Date(2016, 9, 10, 18, 40),
      value3: new Date(2016, 9, 10, 18, 40)
    }
  }, methods: {
    getDateFromToday(addDay) {
      let date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24 * addDay)
      return date
    },
    loadPrivateAccount() {
      let _this = this
      this.$http.fetch(this.$api.guide.wxDeviceGuideRelation.findWidNickSelector).then(resp => {
        if (resp.success && resp.result != null) {
          _this.ownerData = resp.result
        }
      })
    },
    isCurrTarget(index) {
      return index === this.currTargetIndex
    },
    clickTarget(index) {
      this.currTargetIndex = index
      let target = this.targetList[index]
      console.warn(target)
      this.currTargetOwnerId = target.ownerId
      this.currTargetOwnerNick = target.ownerName
      this.currTargetWid = target.talker
      this.currTargetNick = target.talkerName
      // 加载数据
    },
    search() {
      let _this = this
      _this.loading = true
      this.$http.fetch(this.$api.guide.wxChat.findTargetList, this.model).then(resp => {
        _this.loading = false
        _this.targetList = resp.result
        if (_this.targetList.length > 0) {
          _this.clickTarget(0)
        }
      })
    },
    reset() {
      this.model.srhDate = [this.getDateFromToday(-30), new Date()]
      this.model.wid = null
      this.model.content = null
      this.search()
    },
    getHourMinitue(datetime) {
      return datetime.substr(10, 6)
    }
  },
  // 初始化
  mounted: function () {
    this.loadPrivateAccount()
  },
}
