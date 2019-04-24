import tableMixin from 'web-crm/src/mixins/table'
import NsDatetime from 'components/NsDatetime'

export default {
  name: 'NsTableAffairs',
  mixins: [tableMixin],
  props: {
    types: Object
  },
  components: {
    NsDatetime
  },
  data: function () {
    var pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }

    var quickSearchModel = {}
    var model = Object.assign({},
      {
        nickname: '',
        affairsType: '',
        affairsNumber: '',
        orderNumber: '',
        initiator: '',
        outNick: '',
        processingPerson: '',
        processingState: '',
        priority: '',
        keyWord: ''
      },
      {
        created: []
      })

    return {
      affairsState: 'toSolved',
      listNumber: {
        toSolvedNumber: 1,
        inSolvedNumber: 10,
        resolvedNumber: 50,
        superExpectationNumber: 150
      },
      lists: ['1', '2', '3', '4'],
      sortCost: false,
      sortPriority: false,
      sortEstablish: false,
      sortOverdue: false,
      iconState: false,
      dataList: [{
        priority: 'low',
        number: 'JL00000023',
        type: '退款11',
        name: 'tianlhj',
        level: 0,
        time: '2018-07-19 00:00',
        cost: '-',
        state: '解决中',
        intro: '退款请处理',
        handleTitle: '指定处理部门',
        handleContent: '销售部-售前',
        lastUpdateBy: 'admin',
        lastUpdateTime: '2018-07-16 11:27'
      }, {
        priority: 'middle',
        number: 'JL00000023',
        type: '退款11',
        name: 'tianlhj',
        level: 1,
        time: '2018-07-19 00:00',
        cost: '-',
        state: '解决中',
        intro: '退款请处理',
        handleTitle: '指定处理部门',
        handleContent: '销售部-售前',
        lastUpdateBy: 'admin',
        lastUpdateTime: '2018-07-16 11:27'
      }, {
        priority: 'middle',
        number: 'GH00000036',
        type: '退差价',
        name: '秀秀19902',
        level: 2,
        time: '-',
        cost: '-',
        state: '解决中',
        intro: '退差价111',
        handleTitle: '指定处理人',
        handleContent: '巧姐',
        lastUpdateBy: '巧姐',
        lastUpdateTime: '2018-07-16 11:27'
      }, {
        priority: 'low',
        number: 'GH00000031',
        type: '0716测试',
        name: 'String',
        level: 3,
        time: '2018-08-08 17:17',
        cost: '10.00',
        state: '解决中',
        intro: '0716测试',
        handleTitle: '指定处理人',
        handleContent: '陈海龙',
        lastUpdateBy: '陈海龙',
        lastUpdateTime: '2018-07-16 11:27'
      }, {
        priority: 'high',
        number: 'QT00000021',
        type: '电话关怀',
        name: 'koike99',
        level: 4,
        time: '2018-08-11 13:57',
        cost: '10.00',
        state: '解决中',
        intro: '电话关怀',
        handleTitle: '指定处理人',
        handleContent: '-',
        lastUpdateBy: 'admin',
        lastUpdateTime: '2018-07-16 11:27'
      }, {
        priority: 'high',
        number: 'QT00000021',
        type: '电话关怀',
        name: 'koike99',
        level: 5,
        time: '2018-08-11 13:57',
        cost: '10.00',
        state: '解决中',
        intro: '电话关怀',
        handleTitle: '指定处理人',
        handleContent: '-',
        lastUpdateBy: 'admin',
        lastUpdateTime: '2018-07-16 11:27'
      }, {
        priority: 'low',
        number: 'QT00000021',
        type: '电话关怀',
        name: 'koike99',
        level: 6,
        time: '2018-08-11 13:57',
        cost: '10.00',
        state: '解决中',
        intro: '电话关怀',
        handleTitle: '指定处理人',
        handleContent: '-',
        lastUpdateBy: 'admin',
        lastUpdateTime: '2018-07-16 11:27'
      }],
      url: '',
      isIndeterminate: false,
      checkAll: false,
      checkedList: ['1', '2'],
      model: model,
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      _pagination: pagination,
      _queryConfig: {
        expand: false
      }
    }
  },

  mounted: function () {
  },
  methods: {
    onSearch () {
      console.log('搜索响应')
    },
    tabStateClick () {
      console.log('tab点击')
    },
    /* 排序方法 */
    sortByClick (name) {
      if (!this.sortCost && !this.sortPriority && !this.sortEstablish && !this.sortOverdue) {
        this[name] = true
        this.iconState = false
      } else if (this[name] && !this.iconState) {
        this.iconState = true
      } else if (this[name] && this.iconState) {
        this.iconState = false
      } else {
        this.iconState = false
        this.sortCost = false
        this.sortPriority = false
        this.sortEstablish = false
        this.sortOverdue = false
        this[name] = true
      }
    },
    /* 查看聊天记录 */
    viewChat (obj) {
      this.$emit('view-chat', obj)
    },
    /* 修改事务 */
    editAffair (obj) {
      this.$emit('edit-affair', obj)
    },
    /* 处理事务 */
    handleAffair (obj) {
      this.$emit('handle-affair', obj)
    },
    /* 查看订单列表 */
    orderList (obj) {
      this.$emit('order-list', obj)
    },
    copyName (name) {
      var copyVal = document.getElementById('copyVal')
      copyVal.value = name
      copyVal.select()
      document.execCommand('copy')
    }
  }
}
