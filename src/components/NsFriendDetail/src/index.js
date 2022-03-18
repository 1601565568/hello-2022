/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
// import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { Object } from 'core-js'
import NsWechatEmoji from '@nascent/ecrp-ecrm/src/components/NsWechatEmoji'
import ViewSelect from '@/components/NsViewSelect'
// import store from 'store/dist/store.legacy.min.js'
let vm
export default {
  name: 'NsFriendDetail',
  // mixins: [tableMixin],
  components: {
    NsWechatEmoji,
    ViewSelect
  },
  props: {
    value: {
      default: function () {
        return []
      }
    },
    // 开启关闭弹框
    // visible: {
    //   default: function () {
    //     return false
    //   }
    // },
    // 判断平台类型
    cloudPlatformType: {
      type: String,
      default: 'kd'
    },
    detailUrl: {
      type: Object,
      default: function () {
        return this.$api.weWork.externalContact.getCustomerDetail
      }
    },
    // 弹窗标题
    dialogTitle: {
      type: String,
      default: '详情'
    },
    // 是否直接绑定到body下
    appendToBody: {
      type: Boolean,
      default: false
    },
    // 是否需要等待接口返回后才展示弹框
    isOpenDialogAfterRequest: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      // 列表来源map
      addWay: {
        '0': '未知来源',
        '1': '扫描二维码',
        '2': '搜索手机号',
        '3': '名片分享',
        '4': '群聊',
        '5': '手机通讯录',
        '6': '微信联系人',
        '7': '来自微信的添加好友申请',
        '8': '安装第三方应用时自动添加的客服人员',
        '9': '搜索邮箱',
        '201': '内部成员共享',
        '202': '管理员/负责人分配'
      },
      // 好友id
      userId: '',
      // 打开会员弹框店铺id
      shopId: '',
      // 打开会员弹框unid
      unionId: '',
      // 好友详情性别
      isMan: false,
      // 是否是会员
      isVip: false,
      // 是微信还是企微
      isWx: false,
      // 好友详情列表
      friendInfo: {},
      // 好友详情列表
      friendData: [],
      // 表格加载动画
      tableLoading: false,
      // 页码
      pagination4Emp: {
        enable: true,
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      // 视角列表
      viewList: [],
      // 视角Id
      viewId: '',
      visible: false
    }
  },
  computed: {
    /**
     * 区域id
     */
    areaId () {
      return this.$store.state.user.area.id
    }
  },
  methods: {
    /**
     * 打开弹窗时的初始化事件
     */
    async showDetailDialog (val) {
      this.shopId = val.shopId
      this.unionId = val.unionid
      this.userId = val.externalUserId
      this.visible = true
      this.getFriendDetail()
      this.checkVip()
      this.getList(1)
    },
    showVipDetail () {
      this.$emit('showVip', {
        shopId: this.shopId,
        unionId: this.unionId
      })
    },
    // 查询区域对应的视角列表
    findViewList () {
      this.$http.fetch(this.$api.core.common.findViewListByAreaId, { areaId: this.areaId })
        .then(res => {
          if (res.success) {
            if (res.result.length) {
              this.viewList = res.result
              this.viewId = res.result[0].viewId
              this.$emit('viewId', this.viewId)
            }
          } else {
            this.$notify.error(res.msg)
          }
        }).catch(res => {
          this.$notify.error('视角列表查询失败')
        })
    },
    // 视角切换传值
    viewChange () {
      this.$emit('viewId', this.viewId)
      this.checkVip()
    },
    /**
     * 好友详情
     */
    getFriendDetail () {
      let param = { externalUserId: this.userId }
      // 请求好友详情数据

      this.$http.fetch(this.detailUrl, param)
        .then(resp => {
          if (resp.success && resp.result != null) {
            let data = resp.result
            this.friendInfo = data
            this.isMan = data.gender
            this.isWx = data.type + '' === '1'
          }
        }).catch(() => {
          this.$notify.error('查询好友详情信息失败')
        }).finally(() => {
        })
    },
    /**
     * 查询是否是会员
     */
    checkVip () {
      let param = { externalUserId: this.userId, viewId: this.viewId }
      // 请求好友详情数据

      this.$http.fetch(this.$api.weWork.externalContact.isFriendActivate, param)
        .then(resp => {
          if (resp.success && resp.result != null) {
            this.isVip = resp.result + '' === '1'
          }
        }).catch(() => {
          this.$notify.error('查询好友会员信息失败')
        }).finally(() => {
        })
    },
    /**
     * 获取好友对应所属员工列表
     */
    getList (pageNo) {
      this.tableLoading = true
	   // eslint-disable-next-line no-mixed-spaces-and-tabs
      this.pagination4Emp.page = pageNo
      let param = { externalUserId: this.userId, page: pageNo, pageSize: this.pagination4Emp.size }
      // 请求好友详情数据

      this.$http.fetch(this.$api.weWork.externalContact.findExternalUserRelationList, param)
        .then(resp => {
          if (resp.success && resp.result != null) {
            let data = resp.result
            this.friendInfo = data
            this.isMan = data.gender
            this.isVip = data.member
            this.isWx = data.type + '' === '1'
          }
          if (resp.result && resp.result.customerGuideDTOS && resp.result.customerGuideDTOS.length > 0) {
            this.friendData = JSON.parse(JSON.stringify(resp.result.customerGuideDTOS))
          }
          if (resp.result.recordsTotal) {
            this.pagination4Emp.total = parseInt(resp.result.recordsTotal)
          }
        }).catch(() => {
          this.$notify.error('查询列表信息失败')
        }).finally(() => {
          this.tableLoading = false
        })
    },
    /**
     * 关闭弹窗
     */
    onDialogClose () {
      vm.visible = false
    },
    /**
     * 点击页码数量时触发获取员工列表刷新事件
     */
    $sizeChange$: function (size) {
      this.pagination4Emp.size = size
      return this.getList(1)
    }
  },
  mounted: function () {
    vm = this
    this.findViewList()
  },
  created: function () {
  }
}
