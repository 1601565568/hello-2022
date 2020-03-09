<!--
 * @Descripttion: 智能欢迎语
 * @Author: yuye.huang
 * @Date: 2020-02-28 17:28:29
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-03-09 10:22:53
 -->
<template>
  <div>
    <!-- 主列表 -->
    <ns-table-welcome-code ref='table' @onRedactFun='onRedactFun'
      @onShowEmployeeScope='onShowEmployeeScope' @onShowChannelScope='onShowChannelScope' ></ns-table-welcome-code>
    <!-- 使用员工 -->
    <el-dialog ref="employeeDialog" :visible.sync="nsTableEmployeeScopeModel.visible" @open='onOpenEmployeeDialog()'
        title="使用员工"
        width="660px">
      <ns-table-employee-scope ref='employeeTable' :data="nsTableEmployeeScopeModel"></ns-table-employee-scope>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="nsTableEmployeeScopeModel.visible = false">关闭</ns-button>
      </div>
    </el-dialog>
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

    <!-- <ChannelScope :data="channelScopeModel" :channelList="channelList"></ChannelScope> -->
    <!-- @open="this.$queryList$()" -->
    <!-- <el-dialog ref="dialog" title="使用员工" :visible.sync="this.nsTableEmployeeScopeModel.visible" width="660px">
      <ns-table-employee-scope :data="nsTableEmployeeScopeModel"></ns-table-employee-scope>
      <div slot="footer"
          class="dialog-footer">
        <ns-button @click.native.prevent="onCloseEmployeeDialog">关闭</ns-button>
      </div>
    </el-dialog> -->

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
import NsTableEmployeeScope from './components/NsTableEmployeeScope.vue'
// import ChannelScope from './components/ChannelScope.vue'

export default {
  name: 'welcomeCodeList',
  components: {
    NsTableWelcomeCode,
    NsTableEmployeeScope
    // ChannelScope
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
    return {
      nsTableEmployeeScopeModel: nsTableEmployeeScopeModel,
      channelScopeModel: channelScopeModel,
      channelList: []
    }
  },
  methods: {
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
        this.$refs.employeeTable.$reload()
        // this.$refs.employeeTable.$queryList$(this.$refs.employeeTable.$generateParams$())
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
      this.$http.fetch(this.$api.weWork.welcomeCode.findWelcomeCodeChannelList, { uuid: data.welcomeCodeUuid }).then((resp) => {
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
