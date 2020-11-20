import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import moment from 'moment'
export default {
  data () {
    return {
      // 时间筛选
      dateList: [
        {
          label: '全部',
          value: 'all'
        }, {
          label: '近7天',
          value: '7day'
        }, {
          label: '近30天',
          value: '30day'
        }
      ],
      // 时间选择的值
      dateValue: 'all',
      dateValueList: [],
      // 类型筛选
      typeList: [
        {
          label: '参与活动员工总数',
          value: 0,
          id: 'employee',
          key: 'employeeNumber'
        },
        {
          label: '推广大师人数',
          value: 0,
          tip: '筛选期间内，通过此活动成为推广大师总人数（导购发送一客一码的好友即为推广大师）',
          id: 'master',
          key: 'promotionMasterNumber'
        },
        {
          label: '邀请好友总数',
          value: 0,
          tip: '筛选期间内，通过此活动每个导购新增的好友数之和。注意：1、只有第一次添加导购企业微信才算邀请好友数；2、一个微信号添加了多个导购时，好友数为多个',
          id: 'friend',
          key: 'inviteFriendNumber'
        }
      ],
      model: {
        timeStart: ''
      },
      drawer: false,
      analysisType: 'employee', // 报表类型
      startTime: null,
      endTime: null,
      chooseMaster: {}, // 选中的推广大使
      chooseFriend: {}, // 选中的邀请好友
      showType: 'master' // 弹出框显示的内容
    }
  },
  mixins: [tableMixin],
  methods: {
    // 获取列表统计
    getDataTotal () {
      const parmas = {
        guestCodeId: this.$route.query.guestCodeId,
        timeStart: this.startTime,
        timeEnd: this.endTime
      }
      this.$http.fetch(this.$api.guide.customerCode.getGuestStatisticsCount, parmas).then(res => {
        const { result = {
          employeeNumber: 0,
          inviteFriendNumber: 0,
          promotionMasterNumber: 0
        } } = res
        this.typeList = this.typeList.map(item => ({
          ...item,
          value: result[item.key]
        }))
      }).catch(res => {
        this.$notify.error(res.msg)
      })
    },
    // 切换报表
    hanldeChangeType (id) {
      this.analysisType = id
    },
    // 修改时间
    changeDate (day) {
      const timestamp = day * 86400000
      const nowTime = new Date().getTime()
      const oldTime = nowTime - timestamp
      this.startTime = moment(oldTime).format('YYYY-MM-DD HH:mm:ss')
      this.endTime = moment(nowTime).format('YYYY-MM-DD HH:mm:ss')
    },
    // 根据类型修改请求时间
    handleChangeDateType (tab) {
      if (tab.name === 'all') {
        this.startTime = null
        this.endTime = null
      } else {
        this.changeDate(parseInt(tab.name))
      }
      this.getDataTotal()
    },
    // 根据值修改请求时间
    handleChangeDateValue (date) {
      if (date) {
        this.startTime = date[0] || null
        this.endTime = date[1] || null
        this.dateValue = null
      } else {
        this.startTime = null
        this.endTime = null
        this.dateValue = 'all'
      }
      this.getDataTotal()
    },
    // 查看推广大使
    showMaster (item) {
      this.showType = 'master'
      this.drawer = true
      this.chooseMaster = item
    },
    // 查看邀请好友数
    showFriend (item) {
      this.showType = 'friend'
      this.drawer = true
      this.chooseFriend = item
    },
    handleClose () {
      const refs = this.$refs.masterDrawer || this.$refs.friendDrawer
      refs.resetModel()
      this.drawer = false
      const ref = this.$refs.employeeTable || this.$refs.masterTable
      ref.clearActiveIndex()
    },
    // 查看下一个推广大使
    onNextMaster () {
      this.$refs.employeeTable.getOhterGuideForMaster('next')
    },
    // 查看上一个推广大师
    onPrevMaster () {
      this.$refs.employeeTable.getOhterGuideForMaster('prev')
    },
    // 查看下一个好友
    onNextFriend () {
      const ref = this.$refs.employeeTable || this.$refs.masterTable
      ref.getOhterGuideForFriend('next')
    },
    // 查看上一个好友
    onPrevFriend () {
      const ref = this.$refs.employeeTable || this.$refs.masterTable
      ref.getOhterGuideForFriend('prev')
    }
  },
  mounted () {
    this.getDataTotal()
  }
}
