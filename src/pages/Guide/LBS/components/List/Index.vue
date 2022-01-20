<template>
  <div>
    <page-table :title='title' :headerTip='headerTip'>
      <!-- 搜索 start -->
      <template slot='search'>
        <el-form :inline="true" class='form-inline_top'>
          <el-form-item label="参与门店：">
            <shopSelect @callBack="handleChangeShop" :hasShopArr="model.shopIdList" shopStatus='1,-1' isDIYBtn penetrate=1>
              <template slot='btnIcon'>
                <div class='self-btn'>
                  {{(model.shopIdList&&model.shopIdList.length)?`已选择${model.shopIdList.length}个门店`:'全部'}}
                  <Icon type="shop" class='guideIds-icon'></Icon>
                </div>
              </template>
            </shopSelect>
          </el-form-item>
          <el-form-item label="活动状态：" class='el-form__change'>
            <el-select v-model="model.state" placeholder="请选择" @change='(value)=>{changeSearchfrom({state:value})}'>
              <el-option
                v-for="item in statusOptionList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="seachVal" placeholder="请输入活动名称"  @keyup.enter.native="handleSearch" style='width:228px;'>
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
            :data="_data._table.data"
            class="new-table_border"
            :row-style="tableRowClassName"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="活动名称">
              <template slot-scope="scope">
                <div class="scope-title">
                  <div class="scope-title_text">
                    {{scope.row.name}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="guideNames"
              width='90px'
              label="参与门店">
              <template slot-scope="scope">
                <span class="scope-name_tip" slot="reference" @click='handleShowDetail(scope.row,scope.$index)'>{{scope.row.shopNum}}</span>家门店
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              width='90px'
              label="状态">
              <template slot-scope="scope">
                <el-tag :type="statusList[scope.row.state].color" class='scope-name_tag'>{{statusList[scope.row.state].value}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="有效时间">
              <template slot-scope="scope">
                <template v-if="scope.row.timeType === 2">
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
              prop="createName"
              width='120px'
              label="创建人">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间">
            </el-table-column>
            <el-table-column
              width='100px'
              align='center'
              label="二维码">
              <template slot-scope="scope">
                <div class="scope-name scope-name_num box-padding">
                  <Icon type="icon-erweima" className="message-upload__tip" @click='handlePreviewQrcode(scope.row)'/>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align='center'
              width='100px'
              label="海报">
              <template slot-scope="scope">
                <div class="scope-name scope-name_num box-padding">
                  <Icon type="ns-file-picture" className="message-upload__tip" @click='handlePreviewPoster(scope.row)'/>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              width='250px'
              label="操作">
              <template slot-scope="scope">
                <ns-button type="text" @click='handleDetail({guid:scope.row.guid,id:scope.row.id})' v-if='isShowEdit(scope.row)'>编辑</ns-button>
                <ns-button type="text" @click='handleEnd(scope.row.guid,scope.row.createId)' v-if='isShowEdit(scope.row)'>结束活动</ns-button>
                <ns-button type="text" v-copy='scope.row.activityQrcode'>复制链接</ns-button>
                <ns-button type="text" v-if='!(scope.row.state===0 && type==="Friends")' @click='handleAnalysis(scope.row.guid,scope.row.name,scope.row.state)'>效果分析</ns-button>
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
    <PreviewPoster :activityName='dialogData.activityName' :type='dialogData.type' :title='dialogData.type==="qrcode"?"二维码":"海报"' :dialogVisible='dialogVisible' :url='dialogData.placard' :link='dialogData.link' @onClose='dialogVisible = false' appendToBody content='活动链接可用于投放在各个渠道'/>
  </div>
</template>
<script>
import Index from './src/index'
import PageTable from '@/components/NewUi/PageTablePro'
import ElDrawer from '@nascent/nui/lib/drawer'
import PreviewPoster from '../../../components/PreviewPoster'
import ShopList from '../../components/ShopList'
import shopSelect from '../../../components/selectShops'
Index.components = {
  PageTable, ElDrawer, PreviewPoster, ShopList, shopSelect
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
