import $ from 'jquery'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import ElTabs from '@nascent/nui/lib/tabs'
import ElTabsPane from '@nascent/nui/lib/tab-pane'
import ElImage from '@nascent/nui/lib/image'
import moment from 'moment'

export default {
  mixins: [tableMixin],
  components: {
    ElTabs,
    ElTabsPane,
    ElImage
  },
  props: {
    visible: Boolean,
    detailItem: Object,
    times: Array
  },
  data () {
    return {
      activeName: '0',
      url: this.$api.guide.sensitivePermission.detailTable,
      sVisible: false,
      showTableIndex: 0,
      model: {
        type: 0,
        times: [],
        ownerId: '',
        ownerWid: ''
      },
      height: '350px',
      _order: {
        orderDir: 'desc',
        orderKey: 'update_time'
      },
      tableList: [
        {
          name: '删除好友',
          type: 0,
          quantity: 0,
          show: true,
          key: 'delFriend',
          columns: [
            {
              name: '微信信息',
              key: 'nick',
              formatContent: row => {
                return row.detailVo.wid
                  ? `${row.detailVo.nick || '-'}（${row.detailVo.wid}）`
                  : '-'
              }
            },
            {
              name: '会员状态',
              key: 'isMember',
              header: '此微信客户是否为会员',
              align: 'right',
              formatContent: row => {
                if (row.detailVo.isMember === 1) {
                  return '是'
                }
                return '否'
              }
            },
            {
              name: '专属导购',
              key: 'guideName',
              header: '此微信客户是否有专属导购',
              defaultValue: '-'
            },
            {
              name: '操作时间',
              key: 'updateTime',
              standard: true,
              sortable: 'update_time',
              align: 'center',
              width: '150px'
            }
          ],
          data: []
        },
        {
          name: '拉黑好友',
          type: 1,
          quantity: 0,
          show: false,
          key: 'blockFriend',
          columns: [
            {
              name: '微信信息',
              key: 'nick',
              formatContent: row => {
                return row.detailVo.wid
                  ? `${row.detailVo.nick || '-'}（${row.detailVo.wid}）`
                  : '-'
              }
            },
            {
              name: '会员状态',
              key: 'isMember',
              header: '此微信客户是否为会员',
              align: 'right',
              formatContent: row => {
                if (row.detailVo.isMember === 1) {
                  return '是'
                }
                return '否'
              }
            },
            {
              name: '专属导购',
              key: 'guideName',
              header: '此微信客户是否有专属导购',
              defaultValue: '-'
            },
            {
              name: '操作时间',
              key: 'updateTime',
              standard: true,
              sortable: 'update_time',
              align: 'center',
              width: '150px'
            }
          ],
          data: []
        },
        {
          name: '分享名片',
          type: 2,
          quantity: 0,
          show: true,
          key: 'shareCard',
          columns: [
            {
              name: '目标微信',
              key: 'targetNick',
              formatContent: row => {
                return row.detailVo.targetWid
                  ? `${row.detailVo.targetNick || '-'}（${
                    row.detailVo.targetWid
                  }）`
                  : '-'
              }
            },
            {
              name: '名片信息',
              key: 'shareNick',
              formatContent: row => {
                return row.detailVo.shareWid
                  ? `${row.detailVo.shareNick || '-'}（${
                    row.detailVo.shareWid
                  }）`
                  : '-'
              }
            },
            {
              name: '操作时间',
              key: 'updateTime',
              standard: true,
              sortable: 'update_time',
              align: 'center',
              width: '150px'
            }
          ],
          data: []
        },
        {
          name: '安装应用',
          type: 3,
          quantity: 0,
          show: false,
          key: 'installApp',
          columns: [
            {
              name: '应用名称',
              key: 'appName'
            },
            {
              name: '应用大小',
              key: 'appSize'
            },
            {
              name: '操作时间',
              key: 'updateTime',
              standard: true,
              sortable: 'update_time',
              align: 'center',
              width: '150px'
            }
          ],
          data: []
        },
        {
          name: '退群',
          type: 4,
          quantity: 0,
          show: true,
          key: 'quitGroup',
          columns: [
            {
              name: '群名称',
              key: 'displayname'
            },
            {
              name: '群类型',
              key: 'groupType',
              formatContent: row => {
                return row.detailVo.groupType === 1 ? '门店群' : '普通群'
              },
              align: 'center',
              width: '100px'
            },
            {
              name: '群人数',
              key: 'memberCount',
              align: 'right',
              width: '100px'
            },
            {
              name: '操作时间',
              key: 'updateTime',
              standard: true,
              sortable: 'update_time',
              align: 'center',
              width: '150px'
            }
          ],
          data: []
        },
        {
          name: '发红包',
          type: 5,
          quantity: 0,
          show: false,
          key: 'redPacket',
          columns: [
            {
              name: '发送目标',
              key: 'targetNick'
            },
            {
              name: '类型',
              key: 'type',
              formatContent: row => {
                if (!row.detailVo.type) {
                  return ''
                }
                switch (row.detailVo.type) {
                  case 0:
                    return '个人'
                  case 1:
                    return '普通群'
                  case 2:
                    return '员工群'
                  default:
                    return '未知'
                }
              }
            },
            {
              name: '领取人数',
              key: 'quantity'
            },
            {
              name: '红包金额',
              key: 'amount'
            },
            {
              name: '红包说明',
              key: 'remark'
            },
            {
              name: '操作时间',
              key: 'updateTime',
              standard: true,
              sortable: 'update_time',
              align: 'center',
              width: '150px'
            }
          ],
          data: []
        },
        {
          name: '敏感词',
          type: 6,
          quantity: 0,
          show: true,
          key: 'sensitiveWord',
          standard: true,
          columns: [
            {
              name: '好友',
              key: 'friendNick',
              width: '200px',
              formatContent: row => {
                return row.chatroomName || row.friendNick
              }
            },
            {
              name: '敏感词',
              key: 'name',
              width: '100px'
            },
            {
              name: '上下文',
              key: 'content',
              html: true
            },
            {
              name: '操作时间',
              key: 'createTime',
              sortable: 'create_time',
              align: 'center',
              width: '150px'
            }
          ],
          data: []
        },
        {
          name: '撤回消息',
          type: 7,
          quantity: 0,
          show: true,
          standard: true,
          key: 'recallMessage',
          columns: [
            {
              name: '接收人微信',
              key: '',
              formatContent: row => {
                return row.talker ? `${row.nick || '-'}（${row.talker}）` : '-'
              }
            },
            {
              name: '撤回信息内容',
              key: 'content'
            },
            {
              name: '操作时间',
              key: 'createtime',
              sortable: 'm.createtime',
              align: 'center',
              width: '150px'
            }
          ],
          data: []
        },
        {
          name: '删除消息',
          type: 8,
          quantity: 0,
          show: true,
          standard: true,
          key: 'deleteMessage',
          columns: [
            {
              name: '接收人微信',
              key: '',
              formatContent: row => {
                return row.talker ? `${row.nick || '-'}（${row.talker}）` : '-'
              }
            },
            {
              name: '删除信息内容',
              key: 'content'
            },
            {
              name: '操作时间',
              key: 'createtime',
              sortable: 'm.createtime',
              align: 'center',
              width: '150px'
            }
          ],
          data: []
        }
      ]
    }
  },
  watch: {
    visible (value) {
      this.sVisible = value
      if (value) {
        this.model.ownerId = this.detailItem.ownerId
        // 敏感词接口的字段名为ownerWid
        this.model.ownerWid = this.detailItem.ownerId
        this.setCondition()
        this.$searchAction$()
      }
    },
    '_data._table.data' (value) {
      let defaultHeight = 350
      if (value.length > 1) {
        defaultHeight += (value.length - 1) * 30
      }
      this.height = defaultHeight + 'px'
    }
  },
  mounted () {
    this.sVisible = this.visible
  },
  methods: {
    handleClick (tab) {
      this.onSwitchTable(Number(tab.name))
    },
    onClose () {
      this.$emit('update:visible', false)
      this._data._pagination.page = 1
      this._data._table.data = []
    },
    onSwitchTable (index) {
      this._data._table.data = []
      this.showTableIndex = index
      if (index === 6) {
        this.url = this.$api.guide.sensitiveWord.findMonitorList
      } else if (index === 7 || index === 8) {
        this.url = this.$api.guide.sensitivePermission.detailTableFromLog
      } else {
        this.url = this.$api.guide.sensitivePermission.detailTable
      }
      this.$resetInputAction$()
    },
    $resetInput () {
      this.setCondition()
      this.model.type = this.tableList[this.showTableIndex].type
    },
    setCondition () {
      let times = []
      times[0] = moment(this.times[0]).format('YYYY-MM-DD') + ' 00:00:00'
      times[1] = moment(this.times[1]).format('YYYY-MM-DD') + ' 23:59:59'
      if (this.showTableIndex === 6) {
        times[0] = times[0].substr(0, 10)
        times[1] = times[1].substr(0, 10)
        this.model.createDate = times
        this.model.memberSend = 0
        this._data._order.orderKey = 'create_time'
      } else if (this.showTableIndex === 7 || this.showTableIndex === 8) {
        this._data._order.orderKey = 'm.createtime'
        this.model.times = times
      } else {
        this._data._order.orderKey = 'create_time'
        this.model.times = times
      }
      this._data._order.orderDir = 'desc'
    },
    defaultContent (row, item, tableItem) {
      if (tableItem.standard) {
        return row[item.key]
      } else if (item.standard) {
        return row[item.key] || item.defaultValue
      } else {
        return row.detailVo
          ? row.detailVo[item.key] || item.defaultValue
          : item.defaultValue
      }
    },
    $searchAction$ () {
      this._data._table.searchMap = $.extend(true, {}, this.model)
      // 页码变更会触发reload动作
      this._data._pagination.page = 1
      this.$reload().then(data => {
        const key = this.tableList[this.showTableIndex].key + 'Quantity'
        this.detailItem[key] = this._data._pagination.total
      })
      this.$formatTextToShow$()
    }
  }
}
