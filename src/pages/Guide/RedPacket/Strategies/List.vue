<template>
  <div>
    <page-table title='红包策略'>
      <!-- 搜索 start -->
      <template slot='search'>
        <el-form :inline="true" class='form-inline_top'>
          <el-form-item label="">
            <el-input v-model="seachVal" placeholder="请输入红包名称"  @keyup.enter.native="handleSearch" style='width:228px;'>
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
            </el-input>
          </el-form-item>
          <el-form-item label="红包类型：">
            <el-select v-model="model.state" placeholder="请选择" @change='(value)=>{changeSearchfrom({state:value})}'>
              <el-option
                v-for="item in statusOptionList"
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
          <el-form-item label="支付商户号：" class='el-form__change'>
            <el-select v-model="model.state" placeholder="请选择" @change='(value)=>{changeSearchfrom({state:value})}'>
              <el-option
                v-for="item in statusOptionList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发放类型：" class='el-form__change'>
            <el-select v-model="model.state" placeholder="请选择" @change='(value)=>{changeSearchfrom({state:value})}'>
              <el-option
                v-for="item in statusOptionList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot='button'>
        <ns-button type="primary" size='large' @click="handleDetail({})">新建</ns-button>
      </template>
      <!-- 搜索 end -->
      <!-- 表格 start -->
      <template slot='table'>
        <template>
          <el-table
            :data="data"
            class="new-table_border"
            :row-style="tableRowClassName"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="红包名称">
              <template slot-scope="scope">
                <div class="scope-title">
                  <img :src='redPacket' class='scope-img' />
                  <div class="scope-title_text">
                    {{scope.row.name}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="guideNames"
              width='90px'
              label="红包类型">
              <template slot-scope="scope">
                <span class="scope-name_tip" slot="reference" @click='handleShowDetail(scope.row,scope.$index)'>{{scope.row.shopNum}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createName"
              width='120px'
              label="红包总数">
            </el-table-column>
            <el-table-column
              prop="createTime"
              :sortable="'custom'"
              width='100px'
              label="剩余个数">
            </el-table-column>
            <el-table-column
              width='100px'
              align='center'
              label="有效期">
            </el-table-column>
            <el-table-column
              align='center'
              width='100px'
              :sortable="'custom'"
              label="创建时间">
            </el-table-column>
            <el-table-column
              align='center'
              width='100px'
              label="支付商户号">
            </el-table-column>
            <el-table-column
              align='center'
              width='100px'
              label="创建人">
            </el-table-column>
            <el-table-column
              prop="address"
              width='70px'
              label="操作">
              <template slot-scope="scope">
                <ns-button type="text" @click='handleDetail({guid:scope.row.guid,id:scope.row.id})'>查看</ns-button>
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
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="960px"
      :before-close="handleClose">

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Index from './src/list'
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
  height: 50px;
}
</style>
