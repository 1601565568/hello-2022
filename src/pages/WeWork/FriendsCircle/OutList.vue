<template>
  <div>
    <page-table title='对外信息展示' :searchCol='24'>
      <!-- 分类 start -->
      <!-- 分类 end -->
      <!-- 搜索 start -->
      <template slot='search'>
        <div class='blue-tip'>
          <div>请先完成企业微信后台配置</div>
          <div>
            <ns-button type='text' style='margin-right:24px'>去配置</ns-button>
            <ns-button type='text' @click='handlePreview(true)'>配置说明</ns-button>
          </div>
        </div>
      </template>
      <template slot='button'>
      </template>
      <!-- 搜索 end -->
      <!-- 表格 start -->
      <template slot='table'>
        <template>
          <ns-button type="primary" size='large' @click="handleDetail({})" style='margin-bottom:20px'>新建</ns-button>
           <el-table
            :data="data"
            class="new-table_border"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="对外信息名称">
            </el-table-column>
            <el-table-column
              prop="status"
              label="网页说明">
            </el-table-column>
            <el-table-column
              prop="time"
              label="样式">
              <template slot-scope="scope">
                <span class='col-text'>{{scope.row.time}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createName"
              label="状态">
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作">
              <template slot-scope="scope">
                <ns-button type="text" @click='handleDetail({guid:scope.row.guid,id:scope.row.id})'>详情</ns-button>
                <ns-button type="text" @click='handleEnd(scope.row.guid,scope.row.createId)'>删除</ns-button>
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
                        @size-change="handleChangePage('$sizeChange$')"
                        @current-change="handleChangePage('$pageChange$')">
          </el-pagination>
      </template>
      <!-- 页面 end -->
    </page-table>
    <el-dialog
      title="对外信息展示"
      :visible.sync="previewVisin"
      fullscreen>
      <div class='dialog-content'>
        <div class='blue-tip'>
          <div>路径：我的企业->通讯录管理->对外资料显示-修改->添加自定义信息<br/>添加自定义信息：名称可自定义，类型请选择“网页”。</div>
        </div>
        <img src='./images/peizhi1.png' class='full-img'>
        <img src='./images/peizhi2.png' class='full-img'>
        <img src='./images/peizhi3.png' class='full-img'>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Index from './src/OutList'
import PageTable from '@/components/NewUi/PageTablePro'
import NsGuideDialog from '@/components/NsGuideDialog'
import ElDrawer from '@nascent/nui/lib/drawer'
import NsShopDialog from '@/components/NsShopDialog'
import AllTable from './components/List/AllTable'
import EachTable from './components/List/EachTable'
Index.components = {
  PageTable, ElDrawer, NsShopDialog, NsGuideDialog, AllTable, EachTable
}
export default Index
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .title-tab {
    display: flex;
    margin-left: 16px;
    position: relative;
    &::before {
      content: " ";
      position: absolute;
      left: 0;
      top: 50%;
      height: 24px;
      width: 1px;
      margin-top: -12px;
      background: #E8E8E8;
    }
    .tab-item {
      padding: 0 16px;
      font-size: 14px;
      color: #595959;
      cursor: pointer;
      font-weight: normal;
      &.active {
        color: #262626;
        font-weight: bold;
      }
    }
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
  .dialog-content {
    min-height: calc( 100vh - 100px );
    background: #F5F5F5;
    width: 100%;
    .blue-tip {
      margin: 16px 0;
    }
    .full-img {
      width: 100%;
      margin-bottom: 24px;
    }
  }
</style>
