import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'

export default {
  name: 'welcomesIndex',
  mixins: [tableMixin],
  data: function () {
    // 员工使用范围数据model
    let nsTableEmployeeScopeModel = {
      visible: false,
      uuid: ''
    }
    let nsTableShopScopeModel = {
      visible: false,
      uuid: ''
    }
    return {
      dialogTitle: '', // 弹窗标题
      title: '', // 弹出页面的标题
      nsTableEmployeeScopeModel: nsTableEmployeeScopeModel,
      nsTableShopScopeModel: nsTableShopScopeModel,
      sgGuide: {
        group_id: null, // 集团id
        id: '',
        title: '',
        content: ''
      }
    }
  },
  mounted () {
  },
  methods: {
    // 打开弹窗
    onOpenDialog: function (type, title, data) {
      // 新增聊天智能回复
      this.onRedactFun(data)
    },
    // 编辑聊天智能回复
    onRedactFun: function (data) {
      this.$router.push({ path: '/Guide/AutoReply/edit', query: { uuid: data } })
    },
    /**
     * todo 目前仅使用方法 onOpenEmployeeDialog 触发有效
     * @msg: 查看聊天智能回复员工使用范围
     * @param {scope.row}
     */
    onShowEmployeeScope (data) {
      this.nsTableEmployeeScopeModel = {
        uuid: data.uuid,
        visible: true
      }
    },
    /**
     * @msg: 关闭弹框 重新刷新列表数据
     */
    onCloseEmployeeDialog () {
      // 重新刷新列表数据
      this.$nextTick(() => {
        this.$refs.employeeTable.model.employeeName = null
        this.$refs.employeeTable._data._table.searchMap.employeeName = null
        this.$refs.employeeTable._data._table.quickSearchMap.employeeName = null
      })
    },
    /**
     * @msg: 打开弹框 重新刷新列表数据
     */
    onOpenEmployeeDialog () {
      // 重新刷新列表数据
      this.$nextTick(() => {
        if (this.nsTableEmployeeScopeModel.type && this.nsTableEmployeeScopeModel.type === 9) {
          this.nsTableEmployeeScopeModel.uuid = null
        }
        this.$refs.employeeTable.model.uuid = this.nsTableEmployeeScopeModel.uuid
        this.$refs.employeeTable._data._table.searchMap.uuid = this.nsTableEmployeeScopeModel.uuid
        this.$refs.employeeTable._data._table.quickSearchMap.uuid = this.nsTableEmployeeScopeModel.uuid
        this.$refs.employeeTable.$reload()
      })
    },
    /**
     * todo 目前仅使用方法 onOpenShopDialog 触发有效
     * @msg: 查看欢迎语门店使用范围
     * @param {scope.row}
     */
    onShowShopScope (data) {
      this.nsTableShopScopeModel = {
        uuid: data.uuid,
        visible: true
      }
    },
    /**
     * @msg: 关闭弹框 重新刷新门店列表数据
     */
    onCloseShopDialog () {
      // 重新刷新列表数据
      this.$nextTick(() => {
        this.$refs.shopTable.model.shopName = null
        this.$refs.shopTable._data._table.searchMap.shopName = null
        this.$refs.shopTable._data._table.quickSearchMap.shopName = null
      })
    },
    /**
     * @msg: 打开弹框 重新刷新门店列表数据
     */
    onOpenShopDialog () {
      // 重新刷新列表数据
      this.$nextTick(() => {
        this.$refs.shopTable.model.uuid = this.nsTableShopScopeModel.uuid
        this.$refs.shopTable._data._table.searchMap.uuid = this.nsTableShopScopeModel.uuid
        this.$refs.shopTable._data._table.quickSearchMap.uuid = this.nsTableShopScopeModel.uuid
        this.$refs.shopTable.$reload()
      })
    }
  },
  watch: {
  }
}
