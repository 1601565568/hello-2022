<!--
 * @Descripttion: 智能欢迎语
 * @Author: yuye.huang
 * @Date: 2020-02-28 17:28:29
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-03-02 12:14:30
 -->
<template>
  <div>
    <!-- 主列表 -->
    <ns-table-welcome-code @onRedactFun='onRedactFun' @onShowEmployeeScope='onShowEmployeeScope'></ns-table-welcome-code>
    <!-- 弹框使用范围 -->
    <!-- <ns-table-employee-scope :data="nsTableEmployeeScopeModel"></ns-table-employee-scope> -->

    <!-- 渠道使用范围 -->
    <!-- <el-dialog title="使用范围-渠道"  :visible.sync="channelScopeVisible" width="660px" >
      <el-table ref="table" :data="channelScopeTableData" stripe>
      </el-table>
      <div slot="footer">
        <ns-button class="scopeRowCountShow_button" @click="employeeScopeVisible = false">关闭</ns-button>
      </div>
    </el-dialog> -->
    <!-- 跳转至新增/编辑页面 -->
  </div>
</template>

<script>
import NsTableWelcomeCode from './components/NsTableWelcomeCode.vue'
// import NsTableEmployeeScope from './components/NsTableEmployeeScope'

export default {
  name: 'welcomeCodeList',
  components: {
    NsTableWelcomeCode
    // NsTableEmployeeScope
  },
  data: function () {
    // 员工使用范围数据model
    let NsTableEmployeeScopeModel = {
      visible: false,
      welcomeCodeUuid: ''
    }
    return {
      nsTableEmployeeScopeModel: NsTableEmployeeScopeModel,
      // 弹框：员工使用范围
      // employeeScopeVisible: false,
      // 弹框：渠道使用范围
      channelScopeVisible: false,
      // 员工使用范围表格数据
      // employeeScopeTableData: [],
      // 渠道使用范围表格数据
      channelScopeTableData: []
    }
  },
  methods: {
    /**
     * @msg: 查看欢迎语员工使用范围
     * @param {type} scope.row
     */
    onShowEmployeeScope (data) {
      this.NsTableEmployeeScopeModel.welcomeCodeUuid = data.uuid
      this.NsTableEmployeeScopeModel.visible = true
    },
    /**
     * @msg: 编辑智能欢迎语
     * @param {type} scope.row
     */
    onRedactFun (data) {
      this.$router.push({ path: '/WeWork/WelcomeCode/Edit', query: { uuid: data.welcome_code_uuid } })
    }
  }
}
</script>
