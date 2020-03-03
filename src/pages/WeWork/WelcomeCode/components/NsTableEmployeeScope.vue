<!--
 * @Descripttion: 智能欢迎语-使用范围
 * @Author: yuye.huang
 * @Date: 2020-03-02 09:38:22
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-03-03 14:03:58
 -->
<template>
  <!-- <el-dialog ref="dialog" title="使用员工" width="660px"
    :visible.sync="model.visible" @open="this.$queryList$()"> -->
    <ns-page-table ref='table' :colButton="10"> <!-- :visible.sync="this.model.visible" -->
      <!-- 简单搜索 -->
      <template slot="searchSearch">
        <el-form
          :model="quickSearchModel"
          :line="true"
          @submit.native.prevent
          class="pull-right"
        >
          <el-form-item>
            <el-input ref="quickText" style="width: 180px" v-model="quickSearchModel.employeeName" placeholder="请输入员工姓名" @keyup.enter.native="$quickSearchAction$('employeeName')" clearable />
            <ns-button type="primary" @click="$searchAction$()" class="searchbtn">搜索</ns-button>
          </el-form-item>
        </el-form>
      </template>

      <!-- 表格 -->
      <template slot="table">
        <el-table ref="table"  :data="_data._table.data" stripe
          v-loading.lock="_data._table.loadingtable"
          :element-loading-text="$t('prompt.loading')">
          <el-table-column prop="employeeName" label="员工姓名" align="left">
          </el-table-column>
          <el-table-column prop="shopNames" label="工作门店" align="left" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="status" label="在职状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 2">
                <p>已离职</p>
              </div>
              <div v-else>
                <p>在职</p>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 分页 -->
      <template slot="pagination">
        <el-pagination v-if="_data._pagination.enable" class="template-table-pagination"
                        :page-sizes="_data._pagination.sizeOpts"
                        :total="_data._pagination.total"
                        :current-page.sync="_data._pagination.page"
                        :page-size="_data._pagination.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="$sizeChange$"
                        @current-change="$pageChange$">
        </el-pagination>
      </template>
    </ns-page-table>
    <!-- <div slot="footer"
         class="dialog-footer">
      <ns-button @click.native.prevent="alert('ok')">关闭</ns-button>
    </div>
  </el-dialog> -->
</template>

<script>
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'

export default {
  name: 'NsTableEmployeeScope',
  props: {
    data: {
      type: Object,
      default () {
        return {
          visible: false
        }
      }
    }
  },
  mixins: [tableMixin],
  data () {
    let quickSearchModel = {
      employeeName: ''
    }
    let model = Object.assign({}, this.childData)
    return {
      quickSearchModel: quickSearchModel,
      model: model,
      url: this.$api.weWork.welcomeCode.findWelcomeCodeEmployeeList
    }
  },
  mounted () {
    // 加载列表数据
    if (typeof this.$init === 'function') {
      this.$init()
    } else {
      this.$reload()
    }
  },
  methods: {
    /**
     * @msg: 弹框打开加载数据
     */
    open () {
      // this.$queryList$()
    }
  },
  computed: {
    childData: {
      get: function () {
        return this.data
      }
    }
  }
}
</script>
