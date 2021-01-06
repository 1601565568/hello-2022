<template>
  <div>
    <page-table>
      <template slot='search'>
        <div class="titleText">
          朋友圈统计
        </div>
        <el-form :inline="true" class='form-inline_top '>
        <el-form-item label="类型：">
          <el-select v-model="model.status" placeholder="全部">
            <el-option
              v-for="item in statusOptionList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-model="model.datas" placeholder="近一月">
              <el-date-picker
                placeholder="近一月"
                width='143px'
                >
              </el-date-picker>
          </el-form-item>
          <el-form-item label="员工：">
          <el-select v-model="model.staffs" placeholder="全部">
            <el-option
              v-for="item in staff"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="seachVal" width='143px' placeholder="请输入活动名称"  @keyup.enter.native="handleSearch" >
              <Icon type="ns-search-copy" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
            </el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot='table'>
        <template>
          <el-table
            :data="_data._table.data"
            class="new-table_border"
            :row-style="tableRowClassName"
            style="width: 100%">
            <el-table-column
              prop="name"
              width='294px'
              label="内容">
              <template slot-scope="scope">
                <div class="scope-title" @click='handleShowDetail(scope.row,scope.$index)'>
                  <img src='./jieni.jpg' class="scope-title_img">
                  <div class="scope-title_text">
                    {{scope.row.name}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="guideNames"
              width='137px'
              label="类型">
              <template slot-scope="scope">
                <div class="scope-name">
                  <div :class="'scope-name_text'+ (scope.row.guideCount>10?' more':'')" >
                    全部类型
                  </div>
                  <!-- <div class="scope-name_num">
                    共<span class="scope-name_num__blue">{{scope.row.emplee.length}}</span>个
                  </div> -->
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              width='144px'
              label="员工">
              <template >
                <template>
                  <span>刘婷婷听</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              width='277px'
              label="门店">
              <template >
                XXX店、XXX店2、XXXX店3
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              width='224px'
              label="时间">
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作">
              <template slot-scope="scope">
                <ns-button type="text" @click='handleEdit({guestCodeId:scope.row.guestCodeId})'>查看</ns-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </template>
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
    </page-table>
    <el-drawer
      :modal='false'
      size='33.3%'
      @close='handleClose'
      :visible.sync="drawer"
      :with-header="false">
      <ItemDrawer :data='itemDate' @onClose='handleClose' @onPreview="handleAnalysis" @onDelect="handleEnd" @onEdit="handleDetail" @onNext='getOhterGuide("next",handleShowDetail)' @onPrev='getOhterGuide("prev",handleShowDetail)'/>
    </el-drawer>
  </div>
</template>
<script>
import List from './src/List'
import NsGuideDialog from '@/components/NsGuideDialog'
import PageTable from './components/PageTable'
import ElDrawer from '@nascent/nui/lib/drawer'
import ItemDrawer from './components/List/ItemDrawer'
List.components = {
  PageTable, NsGuideDialog, ElDrawer, ItemDrawer
}
export default List
</script>
<style lang="scss" scoped>
  .titleText{
    font-size: 16px;
    color: #262626;
    line-height: 24px;
    font-weight: 700;
    width: 403px;
    height: 24px;
    margin-top: 8px;
  }
  @import "./styles/reset.css";
  .scope-name_tip {
    color: #0091FA
  }
  .scope-title {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .scope-title_img {
    height: 48px;
    width: 48px;
    margin-right: 8px;
    border-radius: 4px;
  }
  .search-icon {
    font-size: 22px;
    margin-top: 2px;
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
      color:#C0C4CC;
    }
  }
</style>
<style lang="scss" scoped>

</style>
