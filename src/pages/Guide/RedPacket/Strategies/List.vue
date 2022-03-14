<template>
  <div>
    <page-table title='红包策略'>
      <!-- 搜索 start -->
      <template slot='search' v-if='!isEmpty'>
        <el-form :inline="true" class='form-inline_top'>
          <el-form-item label="">
            <el-input v-model="model.name" placeholder="请输入红包名称"  @keyup.enter.native="changeSearchfrom" style='width:228px;'>
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="changeSearchfrom"></Icon>
            </el-input>
          </el-form-item>
          <el-form-item label="红包类型：">
            <el-select v-model="model.redpackType" placeholder="请选择" @change='(value)=>{changeSearchfrom({redpackType:value})}'>
              <el-option
                v-for="item in redpacketTypeListSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="有效期：" class='el-form__change'>
            <el-date-picker
              v-model="seachDate"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
              :default-time="['00:00:00','23:59:59']"
              align="right">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="支付商户号：" class='el-form__change'>
            <el-select v-model="model.payConfigId" placeholder="请选择" @change='(value)=>{changeSearchfrom({payConfigId:value})}'>
              <el-option
                v-for="item in payList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发放类型：" class='el-form__change'>
            <el-select v-model="model.launchType" placeholder="请选择" @change='(value)=>{changeSearchfrom({launchType:value})}'>
              <el-option
                v-for="item in setTypeListSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot='button' v-if='!isEmpty'>
        <ns-button type="primary" size='large' @click="handleJump(detailPath,{})">新建</ns-button>
      </template>
      <!-- 搜索 end -->
      <!-- 表格 start -->
      <template slot='table'>
        <template v-if='isEmpty'>
          <NoWxpay>
            <div class='empty-div'>可前往【系统设置】->【授权管理】->【支付配置】进行配置 <ns-button type='text' class='empty-btn' @click='handleJump(payPath)'>去配置</ns-button></div>
          </NoWxpay>
        </template>
        <template v-else>
          <el-table
            :data="_data._table.data"
            v-loading.lock="_data._table.loadingtable"
            class="new-table_border"
            @sort-change="handleSort"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="红包名称">
              <template slot-scope="scope">
                <div class="scope-title">
                  <div class='scope-img'><PreviewRedPacket :bgImage='scope.row.background' :bagTip='scope.row.benediction'/></div>
                  <div class="scope-title_tab">
                    {{scope.row.name}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="state"
              label="红包类型">
              <template slot-scope="scope">
                {{redpacketTypeMap[scope.row.redpackType]}}
              </template>
            </el-table-column>
            <el-table-column
              prop="total"
              :sortable="'custom'"
              label="红包总数">
            </el-table-column>
            <el-table-column
              prop="remainder"
              :sortable="'custom'"
              label="剩余个数">
            </el-table-column>
            <el-table-column
              label="有效期">
              <template slot-scope="scope">
                <template v-if="scope.row.timeType === timeTypeForever">
                  <span>不限</span>
                </template>
                <template v-else>
                  <span>{{scope.row.startTime}}</span>
                  至
                  <span>{{scope.row.endTime}}</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              :sortable="'custom'"
              label="创建时间">
            </el-table-column>
            <el-table-column
              prop="payConfigId"
              label="支付商户号">
              <template slot-scope="scope">
                {{payMap[scope.row.payConfigId]||''}}
              </template>
            </el-table-column>
            <el-table-column
              prop="createName"
              label="创建人">
            </el-table-column>
            <el-table-column
              label="状态">
              <template slot-scope="scope">
                <el-switch
                  @change='(value)=>{handleChangeState(scope.row.id,scope.row.state)}'
                  :value="scope.row.state === normalType">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              width='70px'
              label="操作">
              <template slot-scope="scope">
                <ns-button type="text" @click='handleJump(detailPath,{id:scope.row.id})'>查看</ns-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </template>
      <!-- 表格 end -->
      <!-- 页面 start -->
      <template slot='pagination' v-if='!isEmpty'>
        <el-pagination v-if="_data._pagination.enable"
                        class="template-table__pagination"
                        :page-sizes="_data._pagination.sizeOpts"
                        :total="_data._pagination.total"
                        :current-page="_data._pagination.page"
                        :page-size="_data._pagination.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="$sizeChange$"
                        @current-change="$pageChange$">
          </el-pagination>
      </template>
      <!-- 页面 end -->
    </page-table>
  </div>
</template>
<script>
import Index from './src/list'
import PageTable from '@/components/NewUi/PageTablePro'
import PreviewRedPacket from '../components/PreviewRedPacket'
import NoWxpay from '../components/NoWxpay'
Index.components = {
  PageTable, PreviewRedPacket, NoWxpay
}
export default Index
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.search-icon {
  font-size: 25px;
}
.scope-img {
  min-width: 38.66px;
  max-width: 38.66px;
  margin-right: 15.67px;
}
.scope-title {
  display: flex;
  align-items: center;
}
.empty-div {
  font-size: 14px;
  color: #262626;
  text-align: center;
  line-height: 22px;
  .empty-btn {
    font-size: 14px;
    margin-left: 16px;
  }
}
</style>
