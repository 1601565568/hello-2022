<template>
  <div>
    <page-table>
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
          <el-form-item label="活动状态：" class='el-form__change'>
            <el-select v-model="model.status" placeholder="请选择" @change='(value)=>{changeSearchfrom({status:value})}'>
              <el-option
                v-for="item in statusOptionList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="有效时间：" class='el-form__change'>
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
          <el-form-item label="">
            <el-input v-model="seachVal" placeholder="请输入活动名称"  @keyup.enter.native="handleSearch">
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
            </el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot='button'>
        <ns-button type="primary" size='large' @click="handleDetail({})">新建活动</ns-button>
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
              label="活动名称">
              <template slot-scope="scope">
                <div class="scope-title" @click='handleShowDetail(scope.row,scope.$index)'>
                  <img :src='scope.row.activityPlacard' class="scope-title_img">
                  <div class="scope-title_text">
                    {{scope.row.name}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="guideNames"
              label="参与活动人员">
              <template slot-scope="scope">
                <div class="scope-name">
                  <div :class="'scope-name_text'+ (scope.row.guideCount>10?' more':'')" >
                    {{scope.row.guideNames}}
                  </div>
                  <el-popover
                    placement="top-start"
                    class="item"
                    :title="`参与活动人员（${scope.row.guideCount}）`"
                    width="200"
                    trigger="hover"
                    :content="scope.row.guideCount>10?(scope.row.guideNames+'...'):scope.row.guideNames">
                    <span class="scope-name_tip" slot="reference">共{{scope.row.guideCount}}个</span>
                  </el-popover>
                  <!-- <div class="scope-name_num">
                    共<span class="scope-name_num__blue">{{scope.row.emplee.length}}</span>个
                  </div> -->
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="有效时间">
              <template slot-scope="scope">
                <template v-if="scope.row.validTimeType === 0">
                  <span>永久有效</span>
                </template>
                <template v-else>
                  <span>{{scope.row.validTimeStart}}</span>
                  至
                  <span>{{scope.row.validTimeEnd}}</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              width='90px'
              align='center'
              label="状态">
              <template slot-scope="scope">
                <el-tag :type="statusList[scope.row.status].color" class='scope-name_tag'>{{statusList[scope.row.status].value}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="loginAccount"
              width='100px'
              label="创建人">
            </el-table-column>
            <el-table-column
              prop="createTime"
              width='150px'
              label="创建时间">
            </el-table-column>
            <el-table-column
              prop="address"
              width='250px'
              label="操作">
              <template slot-scope="scope">
                <ns-button type="text" v-if='[1,2].includes(scope.row.status)' @click='handleEdit({guestCodeId:scope.row.guestCodeId})'>编辑</ns-button>
                <ns-button type="text" @click='handleEdit({copyGuestCodeId:scope.row.guestCodeId})'>复制并新建</ns-button>
                <ns-button type="text" v-if='[1,2].includes(scope.row.status)' @click='handleEnd(scope.row.guestCodeId)'>结束活动</ns-button>
                <ns-button type="text" v-if='scope.row.status!==1' @click='handleAnalysis(scope.row.guestCodeId)'>活动效果</ns-button>
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
import PageTable from '@/components/NewUi/PageTable'
import ElDrawer from '@nascent/nui/lib/drawer'
import ItemDrawer from './components/List/ItemDrawer'
List.components = {
  PageTable, NsGuideDialog, ElDrawer, ItemDrawer
}
export default List
</script>
<style lang="scss" scoped>
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
    height: 86px;
    width: 48px;
    margin-right: 8px;
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
    width: 100px;
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
