import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'

export default {
  name: 'welcomesIndex',
  mixins: [tableMixin],
  data: function () {
    // 员工使用范围数据model
    let nsTableEmployeeScopeModel = {
      visible: false,
      welcomeCodeUuid: ''
    }
    return {
      dialogTitle: '', // 弹窗标题
      title: '', // 弹出页面的标题
      nsTableEmployeeScopeModel: nsTableEmployeeScopeModel,
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
      // 新增欢迎语
      this.onRedactFun(data)
    },
    // 编辑智能欢迎语
    onRedactFun: function (data) {
      this.$router.push({ path: '/Guide/speech/edit', query: { uuid: data } })
    },
    /**
     * todo 目前仅使用方法 onOpenEmployeeDialog 触发有效
     * @msg: 查看欢迎语员工使用范围
     * @param {scope.row}
     */
    onShowEmployeeScope (data) {
      this.nsTableEmployeeScopeModel = {
        welcomeCodeUuid: data.uuid,
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
        this.$refs.employeeTable.model.welcomeCodeUuid = this.nsTableEmployeeScopeModel.welcomeCodeUuid
        this.$refs.employeeTable._data._table.searchMap.welcomeCodeUuid = this.nsTableEmployeeScopeModel.welcomeCodeUuid
        this.$refs.employeeTable._data._table.quickSearchMap.welcomeCodeUuid = this.nsTableEmployeeScopeModel.welcomeCodeUuid
        this.$refs.employeeTable.$reload()
      })
    }
  },
  watch: {
  }
}
