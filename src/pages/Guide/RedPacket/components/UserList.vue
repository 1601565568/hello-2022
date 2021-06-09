<!--
 * @Descripttion: 智能欢迎语-使用范围
 * @Author: yuye.huang
 * @Date: 2020-03-02 09:38:22
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-03-09 14:20:05
 -->
<template>
  <!-- <el-dialog ref="dialog" title="使用员工" width="660px"
    :visible.sync="model.visible" @open="this.$queryList$()"> -->
    <ns-page-table ref='table' :colButton="10"> <!-- :visible.sync="this.model.visible" -->
      <!-- 简单搜索 -->
      <template slot="searchSearch">
        <el-form
          :model="model"
          :line="true"
          @submit.native.prevent
          class="pull-right"
        >
          <el-form-item>
            <template v-if='model.useType === 2'>
              <el-input ref="quickText" style="width: 180px" v-model="model.shopName" placeholder="请输入门店"
                      @keyup.enter.native="handleSearch" clearable />
            </template>
            <template v-else>
              <el-input ref="quickText" style="width: 180px" v-model="model.guideName" placeholder="请输入员工"
                      @keyup.enter.native="handleSearch" clearable />
            </template>
            <ns-button type="primary" @click="handleSearch" class="searchbtn" style="margin-right: 10px;margin-left: 5px;">搜索</ns-button>
          </el-form-item>
        </el-form>
      </template>

      <!-- 表格 -->
      <template slot="table">
        <template v-if='model.useType === 2'>
          <el-table ref="table"  :data="_data._table.data" stripe
          v-loading.lock="_data._table.loadingtable"
          :element-loading-text="$t('prompt.loading')">
            <el-table-column prop="shopName" label="门店名称" align="left">
            </el-table-column>
            <el-table-column prop="status" label="门店状态" align="center" width="120">
              <template slot-scope="scope">
                <div>
                  {{scope.row.shopStatus === -2 ? '暂停' : ''}}
                  {{scope.row.shopStatus === -1 ? '关店' : ''}}
                  {{scope.row.shopStatus === -0 ? '删除' : ''}}
                  {{scope.row.shopStatus === 1 ? '正常' : ''}}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template v-else>
          <el-table ref="table"  :data="_data._table.data" stripe
          v-loading.lock="_data._table.loadingtable"
          :element-loading-text="$t('prompt.loading')">
            <el-table-column prop="name" label="员工姓名" align="left">
            </el-table-column>
            <el-table-column prop="shopNames" label="工作门店" align="left" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="status" label="在职状态" align="center" width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.state === 0">
                  <p>已删除</p>
                </div>
                <div v-else>
                  <div v-if="scope.row.status === 2">
                    <p>已离职</p>
                  </div>
                  <div v-else>
                    <p>在职</p>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
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
/*
 * @Descripttion: 使用员工组件
 * @Author: yuye.huang
 * @Date: 2020-03-09 13:55:17
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-03-09 14:26:02
 */
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'

export default {
  name: 'NsTableEmployeeScope',
  props: {
    data: {
      default () {
        return {}
      }
    }
  },
  mixins: [tableMixin],
  data () {
    return {
      model: { ...this.data, shopName: '', guideName: '' },
      url: this.$api.guide.redpacket.getShopOrGuideList
    }
  },
  mounted () {
    this.$reload()
  },
  methods: {
    handleSearch () {
      this.$searchAction$()
    }
  }
}

</script>
