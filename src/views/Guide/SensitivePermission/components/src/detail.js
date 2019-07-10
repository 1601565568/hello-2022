import tableMixin from 'web-crm/src/mixins/table'

export default {
  mixins: [tableMixin],
  props: {
    visible: Boolean
  },
  data () {
    return {
      url: this.$api.guide.sensitivePermission.table,
      sVisible: false,
      showTableIndex: 0,
      model: {
        type: 0
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
              key: ''
            },
            {
              name: '会员状态',
              key: '',
              header: '此微信客户是否为会员'
            },
            {
              name: '专属导购',
              key: '',
              header: '此微信客户是否有专属导购'
            },
            {
              name: '操作时间',
              key: '',
              sortable: 'time'
            }
          ],
          data: []
        },
        {
          name: '拉黑好友',
          type: 1,
          quantity: 0,
          show: false,
          key: 'delFriend',
          columns: [
            {
              name: '微信信息',
              key: ''
            },
            {
              name: '会员状态',
              key: '',
              header: '此微信客户是否为会员'
            },
            {
              name: '专属导购',
              key: '',
              header: '此微信客户是否有专属导购'
            },
            {
              name: '操作时间',
              key: '',
              sortable: 'time'
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
              key: ''
            },
            {
              name: '名片信息',
              key: ''
            },
            {
              name: '操作时间',
              key: '',
              sortable: 'time'
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
              key: ''
            },
            {
              name: '应用大小',
              key: ''
            },
            {
              name: '操作时间',
              key: '',
              sortable: 'time'
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
              key: ''
            },
            {
              name: '群类型',
              key: ''
            },
            {
              name: '群人数',
              key: ''
            },
            {
              name: '操作时间',
              key: '',
              sortable: 'time'
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
              key: ''
            },
            {
              name: '类型',
              key: ''
            },
            {
              name: '领取人数',
              key: ''
            },
            {
              name: '红包金额',
              key: ''
            },
            {
              name: '红包说明',
              key: ''
            },
            {
              name: '操作时间',
              key: '',
              sortable: 'time'
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
              key: '',
              sortable: 'time'
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
    }
  },
  mounted () {
    this.sVisible = this.visible
    this.$searchAction$()
  },
  methods: {
    onClose () {
      this.$emit('update:visible', false)
    },
    onSwitchTable (index) {
      this.showTableIndex = index
      this.$resetInputAction$()
    },
    renderHeader (item) {
      return h => {
        if (!item.header) {
          return item.name
        }
        return h('span', {}, [
          h('span', {}, item.name),
          h('el-popover', {
            props: {
              placement: 'bottom',
              width: '220',
              trigger: 'hover',
              content: item.header
            }
          }, [
            h('i', { slot: 'reference', class: 'iconfont icon-xiangqingyiwen table-header-icon' }, '')
          ])
        ])
      }
    },
    $resetInput () {
      this.model.type = this.tableList[this.showTableIndex].type
    }
  }
}
