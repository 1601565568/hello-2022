<template>
  <div>
    <page-table :title='title'>
      <!-- 搜索 start -->
      <template slot='search'>

      </template>
      <template slot='button'>
        <ns-button type="primary" size='large' @click="handleDetail({})">新建</ns-button>
      </template>
      <!-- 搜索 end -->
      <!-- 表格 start -->
      <template slot='table'>
        <template>

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
      :modal='false'
      size='50%'
      @close='handleClose'
      :visible.sync="drawer"
      :with-header="false">
      <div class='master-close'>
        <i class="el-icon-close" @click="handleClose"></i>
      </div>
      <ShopList v-if='drawer' :guid='dialogData.guid' :type='type' @onNext='getOhter("next",handleShowDetail)' @onPrev='getOhter("prev",handleShowDetail)' />
    </el-drawer>
    <PreviewPoster :activityName='dialogData.activityName' :type='dialogData.type' :title='dialogData.type==="qrcode"?"二维码":"海报"' :dialogVisible='dialogVisible' :url='dialogData.placard' :link='dialogData.link' @onClose='dialogVisible = false' appendToBody content='该链接为聚合码H5，可投放公众号等'/>
  </div>
</template>
<script>
import Index from './src/index'
import PageTable from '@/components/NewUi/PageTablePro'
import ElDrawer from '@nascent/nui/lib/drawer'
import PreviewPoster from '../../../components/PreviewPoster'
import ShopList from '../../components/ShopList'
import NsShopDialog from '@/components/NsShopDialog'
import shopSelect from '../../../components/selectShops'
Index.components = {
  PageTable, ElDrawer, PreviewPoster, ShopList, NsShopDialog, shopSelect
}
export default Index
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .scope-name_tip {
    color: #0091FA;
    cursor: pointer;
  }
  .scope-title {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .scope-title_img {
    height: 86px;
    width: 48px;
    margin-right: 8px;
  }
  .search-icon {
    font-size: 25px;
  }
  .scope-name_text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    &.more:after {
      content:'...'
    }
  }
  .scope-name_tag.el-tag {
    border-radius: 2px;
    &.el-tag--success {
      background: #F7FFF0;
      border: 1px solid #53BF1D;
      color: #262626;
    }
    &.el-tag--info {
      background: #F5F5F5;
      border: 1px solid #D9D9D9;
      color: #262626;
    }
    &.el-tag--warning {
      background: #FFFBE6;
      border: 1px solid #FFAE0D;
      color: #262626;
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
      color:#8C8C8C;
    }
  }
  .message-upload__tip {
    font-size: 20px;
    color:#0091FA;
    cursor: pointer;
  }
  .master-close {
    font-size: 16px;
    padding: 16px 16px 4px 16px;
    .el-icon-close {
      cursor: pointer;
    }
  }
</style>
