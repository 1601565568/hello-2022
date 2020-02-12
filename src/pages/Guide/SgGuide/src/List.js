import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'

export default {
  mixins: [tableMixin],
  data: function () {
    return {
      scopeRowCountShow: false, // 指定员工店铺列表弹出页打开开关
      dialogFormVisible: false, // 详情页面开关
      title: '', // 弹出页面的标题
      shopFindLists: [], // 店铺列表集合
      sgGuide: {
        brand_id: null, // 集团id
        id: '', // 员工账号
        name: '', // 员工名称
        nickname: '', // 员工昵称
        system_role: '', // 系统角色
        department: '', // 部门
        sex: 1, // 性别 1：男  0 女
        mobile: null, // 手机号
        work_prefix: '', // 工号前缀
        work_number: '', // 工号数字
        password: null, // 密码
        image: '', // 头像
        job: null, // 职务 1店长；0导购
        shop_id: null, // 店铺
        remark: '' // 备注
      }
    }
  },
  mounted () {
  },
  methods: {
    // 点击店铺数字，打开指定员工门店列表数据
    scopeRowCount (data) {
      this.scopeRowCountShow = true
      this.title = '查看（' + data.name + '）所属门店详情'
      let tableConfig = this._data._table
      var _this = this
      _this.shopFindLists = []
      tableConfig.loadingtable = true
      _this.$http.fetch(_this.$api.guide.guide.findGuideShopList, { guideId: data.id }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.shopFindLists = resp.result
        }
      }).catch((resp) => {
        return resp
      }).finally(() => {
        tableConfig.loadingtable = false
      })
    },
    // 打开员工详情页，异步显示员工门店列表数据
    async getGuideExtShop (id) {
      let tableConfig = this._data._table
      var _this = this
      _this.shopFindLists = []
      tableConfig.loadingtable = true
      _this.$http.fetch(_this.$api.guide.guide.findGuideShopList, { guideId: id }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.shopFindLists = resp.result
        }
      }).catch((resp) => {
        return resp
      }).finally(() => {
        tableConfig.loadingtable = false
      })
    },
    // 打开员工详情页
    onRedactFun (row) {
      this.row = row
      if (row) {
        this.title = '员工信息详情'
        this.subordinateStores = []
        this.subordinateStores = row.shop_ids.split(',')
        const s = () => {
          this.nextStep = '确定'
          this.sgGuide = {
            id: row.id,
            name: row.name,
            nickname: row.nickname,
            department: row.department_name,
            system_role: row.role_name,
            sex: row.sex,
            mobile: row.mobile,
            work_number: row.work_number,
            work_prefix: row.work_prefix,
            image: row.image,
            job: row.job,
            shop_id: row.shop_id,
            remark: row.remark
          }
          this.dialogFormVisible = true
        }
        s()
        // 异步加载店铺数据
        this._data._table.loadingtable = true
        this.getGuideExtShop(row.id)
      }
    },
    // 打开详情时，先同步店铺信息
    opened () {
      let el
      // el = this.$refs.shopSelectLoadForShop
      // el.findShopPage()
    },
    // 关闭详情弹窗
    cleanGuide (e) {
      var key = window.event.keyCode
      var _this = this
      this.dialogFormVisible = false
      this._data._table.loadingtable = false
    }
  },
  watch: {
  }
}
