/*
 * @Descripttion: 智能欢迎语
 * @Author: yuye.huang
 * @Date: 2020-03-01 16:34:26
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-06-28 17:46:50
 */
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import annexType from '@/config/annexType.js'
import moment from 'moment'

export default {
  name: 'NsTableWelcomeCode',
  mixins: [tableMixin],
  props: {
    // 图片类型 需要大写
    areaIds: {
      default () {
        return ''
      },
      type: String
    }
  },
  watch: {
    areaIds: {
      handler (newVal) {
        // this.areaId = newVal
        this.model.areaId = newVal
        this.init()
      },
      deep: true
    }
  },
  data: function () {
    let quickSearchModel = {}
    let searchModel = {
      'searchGName': '',
      searchEventType: '', // 事件
      // 员工组建 员工值
      guideIds: [],
      // 'timeStart': '',
      // 'timeEnd': '',
      'startTime': moment()
        .subtract('days', 30)
        .format('YYYY-MM-DD'),
      'endTime': moment()
        .subtract('days', 0)
        .format('YYYY-MM-DD')
    }
    let model = Object.assign({}, searchModel)
    return {
      pickerOptions1: {
        disabledDate (time) {
          if (new Date(time).getTime() > new Date().getTime()) {
            return time.getTime() > Date.now() - 2 * 8.64e7
          } else {
            // return time.getTime() < Date.now() - 181 * 8.64e7
          }
        }
      },
      chatRoomOwner: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '删除好友',
          label: '删除好友'
        },
        {
          value: '被删除好友',
          label: '被删除好友'
        },
        {
          value: '退群',
          label: '退群'
        }
      ], // 事件的下拉框
      datePickerValue: [],
      showTodaySelect: true,
      datePickerArr: [],
      selectToday: true,
      today: '',
      lart30: '',
      // 附带内容类型
      annexType: annexType,
      url: this.$api.weWork.weWorkCustomer.queryLossFriendsList,
      model: model,
      quickSearchModel: quickSearchModel,
      _table: {
        loadingtable: false
      }
    }
  },
  mounted () {
    // this.init()
  },
  computed: {
  },
  methods: {
    async init () {
      await this.dealTime()
      await this.dealInitTime()
      this.$reload()
    },
    dealTime () {
      this.today = moment()
        .subtract('days', 0)
        .format('YYYY-MM-DD')
      this.lart30 = moment()
        .subtract('days', 30)
        .format('YYYY-MM-DD')
    },
    dealInitTime () {
      this.datePickerValue = [this.lart30, this.today]
    },
    /**
     * @msg:  事件下拉触发事件
     * @param {Object}
     */
    owenerChange (val) {
      // console.log(val, 78455)
    },
    /**
     * @msg:  从后台获取数据,重新排序
     * @param {Object} val {prop: 'date', order: 'descending'}
     */
    onSortChange (val) {
      this.model.orderKey = val.prop
      this.model.order = val.order
      this.$searchAction$()
    },

    // 选择日期
    // selectTodayClick (val) {
    //   this.datePickerArr = []
    //   this.selectToday = val === 'seven'
    //   const startTime = this.selectToday ? this.last7 : this.lart30
    //   this.showTodaySelect = true
    //   this.datePickerValue = [startTime, this.today]
    // },
    // 时间选择筛选
    datePickerChange (val) {
      this.datePickerArr = val || []
      // let startTime
      // let endTime
      // if (this.datePickerArr.length === 0) {
      //   startTime = ''
      //   endTime = ''
      // } else {
      //   startTime = this.datePickerArr[0]
      //   endTime = this.datePickerArr[1]
      // }
      // this.selectToday = false
      // this.datePickerValue = [startTime, endTime]
      this.model.startTime = this.datePickerArr[0]
      this.model.endTime = this.datePickerArr[1]
    },
    count (time1, time2) {
      let date1 = new Date(time1)
      let date2 = new Date(time2)
      let date = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)
      return date
    },
    // 导出文件
    openFile () {
      const day = this.count(this.model.startTime, this.model.endTime)
      if (day > 30) {
        this.$notify({
          type: 'warning',
          message: '仅支持下载一个月内的流失好友数据，请重新选择时间范围'
        })
        return false
      }
      let maps = Object.assign({}, this.model)
      Object.assign(maps, { areaId: this.areaId })
      const parms = {
        length: this._data._pagination.size,
        searchMap: maps,
        start: (this._data._pagination.page - 1) * this._data._pagination.size
      }
      let that = this
      that.$notify.info('导出中，请稍后片刻')
      this.$http
        .fetch(this.$api.weWork.weWorkCustomer.exportLossFriendsList, parms)
        .then(resp => {
          that.$notify.success('下载完成')
        })
        .catch(resp => {
          if (!resp.size === 0) {
            that.$notify.error('导出报错，请联系管理员')
          } else {
            let url = window.URL.createObjectURL(new Blob([resp]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            let fileName = '好友流失提醒' + this.model.startTime.replaceAll('-', '') + '-' + this.model.endTime.replaceAll('-', '') + '.xlsx'
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
          }
        })
    }
  }
}
