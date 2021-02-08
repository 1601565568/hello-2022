<!--
 * @Descripttion: 重复好友
 * @Author: xiaotx
 * @Date: 2021-02-7 17:28:29
 * @LastEditors: xiaotx
 * @LastEditTime: 2021-02-7 17:28:29
 -->
<template>
  <div>
    <!-- 主列表 -->
    <ns-table-repeat-customer ref='table' @onRedactFun="onRedactFun"
      @onShowEmployeeScope='onShowEmployeeScope'></ns-table-repeat-customer>
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
    <!-- 查看导购详情开始-->
    <el-dialog title="详情" :visible.sync="RepeatCustomerShow" width="600px" class="detail-dialog">
      <div class="detail-dialog__content">
        <div class="detail-rightside">
        </div>
        <el-form label-width="90px" class="detail-leftside">
          <el-form-item >
            <el-form-grid>
              <el-image
                :width="84" :height="84"
                :src="guide.avatar ? guide.avatar : require('@/icons/fill/shangjiatouxiang.svg')"
                mode="cover" :circle="true" class="detail-rightside__img"></el-image>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="昵称：" >
            <el-form-grid>
              <span>{{guide.name}}</span>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="性别：">
            <el-form-grid>
              <span>{{guide.gender}}</span>
            </el-form-grid>
          </el-form-item>
          <el-form-item>
            <el-form-grid>
              <el-table ref="table" :data="shopFindLists" stripe
                        resizable v-loading.lock="_data._table.loadingtable"
                        :element-loading-text="$t('prompt.loading')" >
                <el-table-column label="所属员工" align="left" >
                  <template slot-scope="scope">
                    {{scope.row.name}}
                  </template>
                </el-table-column>
                <el-table-column label="员工门店">
                  <template slot-scope="scope">
                    {{scope.row.shop_name}}
                  </template>
                </el-table-column>
                <el-table-column label="添加时间" width="220">
                  <template slot-scope="scope">
                    {{scope.row.add_time}}
                  </template>
                </el-table-column>
              </el-table>
            </el-form-grid>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="cleanGuide">关闭</ns-button>
      </div>
    </el-dialog>
    <!--  查看导购详情结束 -->
  </div>
</template>

<script>
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsTableRepeatCustomer from './components/NsTableRepeatCustomer.vue'
import NsTableEmployeeScope from './components/NsTableEmployeeScope.vue'
import ElImage from '@nascent/nui/lib/image'

export default {
  mixins: [tableMixin],
  name: 'welcomeCodeList',
  components: {
    NsTableRepeatCustomer,
    NsTableEmployeeScope,
    ElImage
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
      RepeatCustomerShow: false,
      nsTableEmployeeScopeModel: nsTableEmployeeScopeModel,
      channelScopeModel: channelScopeModel,
      nsTableShopScopeModel: nsTableShopScopeModel,
      channelList: [],
      shopList: [],
      guide: {},
      shopFindLists: []
    }
  },
  methods: {
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
    // 打开员工详情页
    onRedactFun (row) {
      if (row) {
        this.RepeatCustomerShow = true
        this.guide = row
        this.getGuideExtShop(row.external_user_id)
      }
    },
    // 打开员工详情页，异步显示员工门店列表数据
    async getGuideExtShop (id) {
      let tableConfig = this._data._table
      var _this = this
      tableConfig.loadingtable = true
      _this.$http.fetch(_this.$api.weWork.weWorkCustomer.getRepeatGuideList, { id: id }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.shopFindLists = resp.result
        }
      }).catch((resp) => {
        return resp
      }).finally(() => {
        tableConfig.loadingtable = false
      })
    },
    // 关闭详情弹窗
    cleanGuide (e) {
      this.RepeatCustomerShow = false
      this._data._table.loadingtable = false
      this.guide = {}
      this.shopFindLists = []
    }
  }
}
</script>
