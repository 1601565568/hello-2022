<template>
  <div>
    <!-- 主列表 -->
    <ns-table-welcome-code ref='table' @onRedactFun='onRedactFun'
      @onShowEmployeeScope='onShowEmployeeScope' @onShowChannelScope='onShowChannelScope' @onShowShopScope='onShowShopScope' ></ns-table-welcome-code>
    <!-- 使用员工 -->
    <el-dialog ref="employeeDialog" :visible.sync="nsTableEmployeeScopeModel.visible"
      @open='onOpenEmployeeDialog()' @closed='onCloseEmployeeDialog()'
        title="使用员工"
        width="720px">
      <ns-table-employee-scope ref='employeeTable' :data="nsTableEmployeeScopeModel"></ns-table-employee-scope>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="nsTableEmployeeScopeModel.visible = false">关闭</ns-button>
      </div>
    </el-dialog>
    <!-- 使用门店 -->
    <el-dialog ref="shopDialog" :visible.sync="nsTableShopScopeModel.visible"
               @open='onOpenShopDialog()' @closed='onCloseShopDialog()'
               title="使用门店"
               width="720px">
      <ns-table-shop-scope ref='shopTable' :data="nsTableShopScopeModel"></ns-table-shop-scope>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="nsTableShopScopeModel.visible = false">关闭</ns-button>
      </div>
    </el-dialog>
    <!-- 使用门店 -->
        <!-- 使用渠道 -->
    <el-dialog :visible.sync="channelScopeModel.visible"
            title="使用渠道"
            width="400px">
      <el-table :data="channelList" stripe
        v-loading.lock="channelScopeModel.loadingtable"
        :element-loading-text="$t('prompt.loading')">
        <el-table-column property="label" label="渠道名称" align="left"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onCloseChannelDialog">关闭</ns-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import NsTableWelcomeCode from './components/NsTableWelcomeCode.vue'
import NsTableEmployeeScope from './components/NsTableEmployeeScope.vue'
import NsTableShopScope from '@/components/NsTableShopDialog/NsTableShopScope.vue'

export default {
  name: 'welcomeCodeList',
  components: {
    NsTableWelcomeCode,
    NsTableEmployeeScope,
    NsTableShopScope
  },
  data () {
    // 员工使用范围数据model
    let nsTableEmployeeScopeModel = {
      visible: false,
      welcomeCodeUuid: ''
    }
    // 渠道使用范围数据model
    let channelScopeModel = {
      visible: false,
      welcomeCodeUuid: '',
      loadingtable: false
    }
    // 门店使用范围数据model
    let nsTableShopScopeModel = {
      visible: false,
      welcomeCodeUuid: ''
    }
    return {
      nsTableEmployeeScopeModel: nsTableEmployeeScopeModel,
      channelScopeModel: channelScopeModel,
      nsTableShopScopeModel: nsTableShopScopeModel,
      channelList: [],
      shopList: []
    }
  },
  methods: {
    /**
     * todo 目前仅使用方法 onOpenShopDialog 触发有效
     * @msg: 查看欢迎语门店使用范围
     * @param {scope.row}
     */
    onShowShopScope (data) {
      this.nsTableShopScopeModel = {
        welcomeCodeUuid: data.welcomeCodeUuid,
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
        this.$refs.shopTable.model.welcomeCodeUuid = this.nsTableShopScopeModel.welcomeCodeUuid
        this.$refs.shopTable._data._table.searchMap.welcomeCodeUuid = this.nsTableShopScopeModel.welcomeCodeUuid
        this.$refs.shopTable._data._table.quickSearchMap.welcomeCodeUuid = this.nsTableShopScopeModel.welcomeCodeUuid
        this.$refs.shopTable.$reload()
      })
    },
    /**
     * todo 目前仅使用方法 onOpenEmployeeDialog 触发有效
     * @msg: 查看欢迎语员工使用范围
     * @param {scope.row}
     */
    onShowEmployeeScope (data) {
      this.nsTableEmployeeScopeModel = {
        welcomeCodeUuid: data.welcomeCodeUuid,
        visible: true
      }
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
    },
    /**
     * @msg: 打开弹框 重新刷新列表数据
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
     * @msg: 查看欢迎语渠道使用范围
     * @param {scope.row}
     */
    onShowChannelScope (data) {
      this.channelScopeModel = {
        visible: true,
        welcomeCodeUuid: data.welcomeCodeUuid,
        loadingtable: true
      }
      this.$http.fetch(this.$api.weWork.welcomeCode.findWelcomeCodeChannelList, { welcomeCodeUuid: data.welcomeCodeUuid }).then((resp) => {
        this.channelList = resp.result
        this.channelScopeModel.loadingtable = false
      }).catch((resp) => {
        this.$notify.error(resp.msg)
      })
    },
    /**
     * @msg: 弹框关闭处理
     */
    onCloseChannelDialog () {
      this.channelScopeModel.visible = false
      this.channelList = []
    },
    /**
     * @msg: 编辑智能欢迎语
     * @param {scope.row}
     */
    onRedactFun (data) {
      this.$router.push({ path: '/WeWork/WelcomeCode/Edit', query: { welcomeCodeUuid: data.welcomeCodeUuid } })
    }
  }
}
</script>
