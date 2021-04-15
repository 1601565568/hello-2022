<template>
  <div>
    <page-table title='红包封面'>
      <!-- 搜索 start -->
      <template slot='search'>
        <el-form :inline="true" class='form-inline_top'>
          <el-form-item label="">
            <el-input v-model="seachVal" placeholder="请输入封面名称"  @keyup.enter.native="handleSearch" style='width:228px;'>
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
            </el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="seachVal" placeholder="请输入创建人名称"  @keyup.enter.native="handleSearch" style='width:228px;'>
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
            </el-input>
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
              label="红包封面">
              <template>
                <div class="scope-title">
                  <img :src='redPacket' class='scope-img' />
                  <div class="scope-title_tab">
                    默认
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="guideNames"
              label="封面名称">
            </el-table-column>
            <el-table-column
              align='center'
              :sortable="'custom'"
              label="创建时间">
            </el-table-column>
            <el-table-column
              align='center'
              label="创建人">
            </el-table-column>
            <el-table-column
              align='center'
              label="默认封面">
            </el-table-column>
            <el-table-column
              prop="address"
              width='170px'
              label="操作">
              <template slot-scope="scope">
                <ns-button type="text" @click='handleDetail({guid:scope.row.guid,id:scope.row.id})'>编辑</ns-button>
                <ns-button type="text" @click='handleDetail({guid:scope.row.guid,id:scope.row.id})'>查看</ns-button>
                <ns-button type="text" @click='handleDetail({guid:scope.row.guid,id:scope.row.id})'>删除</ns-button>
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
    <el-drawer
      title="红包封面预览"
      :visible.sync="drawer"
      :before-close="handleClose">
      <div class='packet-box'><RedPacket/></div>
    </el-drawer>
  </div>
</template>
<script>
import Index from './src/list'
import PageTable from '@/components/NewUi/PageTablePro'
import ElDrawer from '@nascent/nui/lib/drawer'
import RedPacket from '../components/RedPacket'
Index.components = {
  PageTable, ElDrawer, RedPacket
}
export default Index
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.search-icon {
  font-size: 25px;
}
.scope-title {
  display: flex;
  align-items: center;
}
.scope-title_tab {
  width: 42px;
  height: 24px;
  background: #F2F9FE;
  border-radius: 2px;
  text-align: center;
  line-height: 24px;
  color: #0091FA;
}
.scope-img {
  height: 50px;
}
.packet-box {
  width: 375px;
  margin: 0 auto;
  font-size: 30px;
}
</style>
