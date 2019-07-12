import tableMixin from 'web-crm/src/mixins/table'

export default {
  mixins: [tableMixin],
  props: {
    visible: Boolean,
    detailItem: Object
  },
  data () {
    return {
      url: this.$api.guide.sensitivePermission.detailTable,
      sVisible: false,
      showTableIndex: 0,
      model: {
        type: 0
      },
      height: '550px',
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
              formatContent: (row) => {
                return row.detailVo.nick ? `${row.detailVo.nick}（${row.detailVo.wid}）` : ''
              }
            },
            {
              name: '会员状态',
              key: 'isMember',
              header: '此微信客户是否为会员',
              align: 'right',
              formatContent: (row) => {
                if (row.detailVo.isMember === 1) {
                  return '是'
                }
                return '否'
              }
            },
            {
              name: '专属导购',
              key: 'guideName',
              header: '此微信客户是否有专属导购'
            },
            {
              name: '操作时间',
              key: 'time',
              sortable: 'update_time',
              align: 'center'
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
              formatContent: (row) => {
                return row.detailVo.nick ? `${row.detailVo.nick}（${row.detailVo.wid}）` : ''
              }
            },
            {
              name: '会员状态',
              key: 'isMember',
              header: '此微信客户是否为会员',
              align: 'right',
              formatContent: (row) => {
                if (row.detailVo.isMember === 1) {
                  return '是'
                }
                return '否'
              }
            },
            {
              name: '专属导购',
              key: 'guideName',
              header: '此微信客户是否有专属导购'
            },
            {
              name: '操作时间',
              key: 'time',
              sortable: 'update_time',
              align: 'center'
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
              formatContent: (row) => {
                return row.detailVo.targetNick ? `${row.detailVo.targetNick}（${row.detailVo.targetWid}）` : ''
              }
            },
            {
              name: '名片信息',
              key: 'shareNick',
              formatContent: (row) => {
                return row.detailVo.shareNick ? `${row.detailVo.shareNick}（${row.detailVo.shareWid}）` : ''
              }
            },
            {
              name: '操作时间',
              key: 'time',
              sortable: 'update_time',
              align: 'center'
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
              key: 'time',
              sortable: 'update_time',
              align: 'center'
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
              formatContent: (row) => {
                return row.detailVo.groupType === 1 ? '门店群' : '普通群'
              }
            },
            {
              name: '群人数',
              key: 'memberCount'
            },
            {
              name: '操作时间',
              key: 'time',
              sortable: 'update_time',
              align: 'center'
            }
          ],
          data: []
        },
        {
          name: '发红包',
          type: 5,
          quantity: 0,
          show: true,
          key: 'redPacket',
          columns: [
            {
              name: '发送目标',
              key: 'targetNick'
            },
            {
              name: '类型',
              key: 'type',
              formatContent: (row) => {
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
              key: 'time',
              sortable: 'update_time',
              align: 'center'
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
          columns: [
            {
              name: '好友',
              key: ''
            },
            {
              name: '敏感词',
              key: ''
            },
            {
              name: '上下文',
              key: ''
            },
            {
              name: '操作时间',
              key: 'time',
              sortable: 'update_time',
              align: 'center',
              width: '120px'
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
        this.$searchAction$()
      }
    },
    '_data._table.data' (value) {
      let defaultHeight = 550
      if (value.length > 1) {
        defaultHeight += (value.length - 1) * 30
        this.height = defaultHeight
      }
    }
  },
  mounted () {
    this.sVisible = this.visible
  },
  methods: {
    onClose () {
      this.$emit('update:visible', false)
      this._data._pagination.page = 1
      this._data._table.data = []
    },
    onSwitchTable (index) {
      this.showTableIndex = index
      this.$resetInputAction$()
    },
    $resetInput () {
      this.model.type = this.tableList[this.showTableIndex].type
    }
  }
}
