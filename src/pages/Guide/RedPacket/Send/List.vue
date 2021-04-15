<template>
  <div>
    <page-table title='红包策略'>
      <!-- 搜索 start -->
      <template slot='search'>
        <el-form :inline="true" class='form-inline_top'>
          <el-form-item label="参与员工：">
            <NsGuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" :auth="false" type="primary" btnTitle="" dialogTitle="选择员工" v-model="model.guideIds" @input="handleChangeGuide">
              <template slot='selfBtn'>
                <div class='self-btn'>
                  {{(model.guideIds&&model.guideIds.length)?`已选择${model.guideIds.length}个员工`:'全部'}}
                  <Icon type="geren" class='guideIds-icon'></Icon>
                </div>
              </template>
            </NsGuideDialog>
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
              label="红包类型">
              <template slot-scope="scope">
                <span class="scope-name_tip" slot="reference" @click='handleShowDetail(scope.row,scope.$index)'>{{scope.row.shopNum}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createName"
              label="单个金额">
            </el-table-column>
            <el-table-column
              prop="createTime"
              :sortable="'custom'"
              label="剩余个数">
            </el-table-column>
            <el-table-column
              align='center'
              width='100px'
              :sortable="'custom'"
              label="使用人员">
            </el-table-column>
            <el-table-column
              align='center'
              label="红包有效期">
            </el-table-column>
            <el-table-column
              align='center'
              label="状态">
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
import NsGuideDialog from '@/components/NsGuideDialog'
Index.components = {
  PageTable, NsGuideDialog
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
.self-btn {
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #606266;
  .guideIds-icon {
    color:#C0C4CC;
  }
}
</style>
