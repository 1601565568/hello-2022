export default {
  data: function () {
    return {
      affairsActive: 'establish',
      dialogChat: false,
      dialogChatActive: 'nearly',
      keyWord: '',
      chatTime: [],
      service: '',
      chatRecord: [
        {
          date: '2018-07-01',
          link: '#',
          recordList: [
            {
              serviceName: '孔方时代:大师',
              serviceTime: '16:39:15',
              serviceContent: 'dd：http://s.9crm.cn/jalqz?buyerNick=mu0116mu&serviceBuyerNick=%E5%AD%94%E6%96%B9%E6%97%B6%E4%BB%A3%3A%E5%A4%A7%E5%B8%88'
            },
            {
              serviceName: '孔方时代:大师',
              serviceTime: '16:43:28',
              serviceContent: '测试1：http://s.9crm.cn/DWHOS?buyerNick=mu0116mu&serviceBuyerNick=%E5%AD%94%E6%96%B9%E6%97%B6%E4%BB%A3%3A%E5%A4%A7%E5%B8%88'
            },
            {
              serviceName: '孔方时代:大师',
              serviceTime: '17:10:45',
              serviceContent: 'test：http://s.9crm.cn/Xn0cz?buyerNick=mu0116mu&serviceBuyerNick=%E5%AD%94%E6%96%B9%E6%97%B6%E4%BB%A3%3A%E5%A4%A7%E5%B8%88'
            }
          ]
        },
        {
          date: '2018-06-07',
          link: '#',
          recordList: [
            {
              serviceName: '孔方时代:龙王',
              serviceTime: '10:22:22',
              serviceContent: 'mu0116mu，周梅，15990007033，浙江省杭州市，江干区，九堡镇东方电子商务园 6幢四楼南讯软件'
            },
            {
              serviceName: '孔方时代:龙王',
              serviceTime: '10:22:44',
              serviceContent: '亲，请核对您的宝贝信息： 年货定制款单拍不发 (数量：1件)'
            },
            {
              serviceName: '孔方时代:龙王',
              serviceTime: '10:49:11',
              serviceContent: 'http://item.taobao.com/item.htm?id=19750633794'
            }
          ]
        }
      ],
      dialogOrder: false,
      dialogEdit: false,
      dialogHandle: false,
      // 历史事务表格数据
      tableData: [{
        date: '2018/8/6 19:58:20',
        type: '事务类型01',
        remarks: '事务类型01批量'
      }, {
        date: '2018/8/7 13:35:35',
        type: '吃吃吃',
        remarks: '4人处理'
      }, {
        date: '2018/8/7 13:35:35',
        type: '事务类型01',
        remarks: '事务类型01批量'
      }, {
        date: '2018/8/7 13:35:35',
        type: '吃吃吃',
        remarks: '4人处理'
      }]
    }
  },
  created: function () {
  },
  mounted: function () {
  },
  methods: {
    tabClick (tab) {
      switch (tab.name) {
        case 'establish': console.log('我创建的事务'); break
        case 'appoint': console.log('指派给我的事务'); break
        case 'designate': console.log('指派出去的事务'); break
        case 'all': console.log('全部事务'); break
        default:break
      }
    },
    openChat (obj) {
      this.dialogChat = true
      console.log('聊天记录', obj)
    },
    openEdit (obj) {
      this.dialogEdit = true
      console.log('修改', obj)
    },
    openHandle (obj) {
      this.dialogHandle = true
      this.$nextTick(() => {
        this.$refs.recordHeight.$el.children[0].style.maxHeight = '150px'
      })
      console.log('处理', obj)
    },
    openOrderList (obj) {
      this.dialogOrder = true
      console.log('订单列表', obj)
    }
  }
}
