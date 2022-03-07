<template>
  <div>
    <page-table title='红包封面'>
      <!-- 搜索 start -->
      <template slot='search'>
        <el-form :inline="true" class='form-inline_top' @submit.native.prevent>
          <el-form-item label="">
            <el-input v-model="model.name" placeholder="请输入封面名称"  @keyup.enter.native="changeSearchfrom" style='width:228px;'>
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="changeSearchfrom"></Icon>
            </el-input>
          </el-form-item>
          <!-- <el-form-item label="">
            <el-input v-model="model.operatorName" placeholder="请输入创建人名称"  @keyup.enter.native="changeSearchfrom" style='width:228px;'>
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="changeSearchfrom"></Icon>
            </el-input>
          </el-form-item> -->
        </el-form>
      </template>
      <template slot='button'>
        <ns-button type="primary" size='large' @click="handleJump(detailPath,{})">新建</ns-button>
      </template>
      <!-- 搜索 end -->
      <!-- 表格 start -->
      <template slot='table'>
        <template>
          <el-table
            :data="_data._table.data"
            class="new-table_border"
            v-loading.lock="_data._table.loadingtable"
            @sort-change="handleSort"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="红包封面">
              <template slot-scope="scope">
                <div class="scope-title" :class="[ fuscous=== 'QA' && 'styQA']">
                  <div class='scope-img'><PreviewRedPacket :bgImage='scope.row.background' /></div>
                  <!-- <img :src='redPacket' class='scope-img' /> -->
                  <div class="scope-title_tab" v-if='scope.row.isDefault'>
                    默认
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="封面名称">
            </el-table-column>
            <el-table-column
              prop="createTime"
              :sortable="'custom'"
              label="创建时间">
            </el-table-column>
            <el-table-column
              prop="operatorName"
              label="创建人">
              <template slot-scope="scope">
                {{scope.row.operatorName||'-'}}
              </template>
            </el-table-column>
            <el-table-column
              align='center'
              label="默认封面">
              <template slot-scope="scope">
                <el-switch
                  @change='handleChangeState(scope.row.id,scope.row.isDefault)'
                  :value="scope.row.isDefault" :class="[fuscous==='QA'?fuscousQA:fuscousIcon]">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              width='170px'
              label="操作">
              <template slot-scope="scope">
                <ns-button  style='margin-right:5px;' type="text" @click='handleJump(detailPath,{id:scope.row.id})'>编辑</ns-button>
                <PreviewRedPacket :bgImage='scope.row.background'><ns-button type="text">查看</ns-button></PreviewRedPacket>
                <ns-button type="text"  style='margin-left:5px;' @click='handleDelete(scope.row.id,scope.row.isDefault)'>删除</ns-button>
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
import Index from './src/list'
import PageTable from '@/components/NewUi/PageTablePro'
import ElDrawer from '@nascent/nui/lib/drawer'
import RedPacket from '../components/RedPacket'
import PreviewRedPacket from '../components/PreviewRedPacket'
Index.components = {
  PageTable, ElDrawer, RedPacket, PreviewRedPacket
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
  width: 38.66px;
  margin-right: 15.67px;
}
</style>
<style scoped>
.styQA >>> .scope-title_tab{
  color: #2153D4;
}
.fuscousQA.is-checked >>> .el-switch__core {
  border-color: #0C4CFF;
    background-color: #0C4CFF;
}
.fuscousIcon.is-checked >>>.el-switch__core {
  border-color: #41a2e8;
    background-color: #41a2e8;
}
</style>
