<template>
  <div>
    <page-table title='领取记录'>
      <!-- 搜索 start -->
      <template slot='search'>
        <el-form :inline="true" class='form-inline_top'>
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
          <el-form-item label="红包类型：">
            <el-select v-model="model.redpackType" placeholder="请选择" @change='(value)=>{changeSearchfrom({redpackType:value})}'>
              <el-option
                v-for="item in redpacketTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="有效期：">
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
          <el-form-item label="发放类型：" class='el-form__change'>
            <el-select v-model="model.launchType" placeholder="请选择" @change='(value)=>{changeSearchfrom({launchType:value})}'>
              <el-option
                v-for="item in setTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="model.name" placeholder="请输入红包名称"  @keyup.enter.native="handleSearch" style='width:228px;'>
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
            </el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot='button'>
        <ns-button size='large'>导出CSV文件</ns-button>
      </template>
      <!-- 搜索 end -->
      <!-- 表格 start -->
      <template slot='table'>
        <template>
          <el-table
            :data="_data._table.data"
            class="new-table_border"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="领取人">
            </el-table-column>
            <el-table-column
              prop="state"
              label="发放类型">
            </el-table-column>
            <el-table-column
              prop="total"
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
                  <span>永久有效</span>
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
                  :value="scope.row.state === 1">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              width='70px'
              label="操作">
              <template slot-scope="scope">
                <ns-button type="text" @click='handleDetail({id:scope.row.id})'>查看</ns-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </template>
      <!-- 表格 end -->
      <!-- 页面 start -->
      <template slot='pagination'>
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
import Index from './src/index'
import PageTable from '@/components/NewUi/PageTablePro'
Index.components = {
  PageTable
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
</style>
