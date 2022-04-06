<template>
  <div class='detail-container'>
    <h3 class='header-text'>
      <img :src='backIcon' class='back-icon' @click='handleBack'/>
      朋友圈详情
    </h3>
    <div class='container detail'>
      <EmojiText :text='data.activityIntroductionHtml' pre='EMOJI_'/>
      <div class='date'>
        <div>2020/07/18 12:00</div>
        <ns-button type='text'>
          <span class="iconfont icon-kejiankehu"></span>
          可见客户
        </ns-button>
      </div>
    </div>
    <page-table :searchCol='24'>
      <template slot='search'>
        <el-form :inline="true" class='form-inline_top' @submit.native.prevent>
          <el-form-item label="所属员工：">
            <NsGuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" :auth="false" type="primary" btnTitle="" dialogTitle="选择员工" v-model="guideIds" @input="handleChangeGuide">
              <template slot='selfBtn'>
                <div class='self-btn'>
                  {{(guideIds&&guideIds.length)?`已选择${guideIds.length}个员工`:'全部'}}
                  <Icon type="geren" class='guideIds-icon'></Icon>
                </div>
              </template>
            </NsGuideDialog>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="seachVal" placeholder="请输入员工姓名"  @keyup.enter.native="handleSearch">
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
            </el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot='button'>
        <ns-button type="primary" size='large' @click="employeeListExportClick" id="exportButton">导&nbsp;出</ns-button>
      </template>
      <template slot='table'>
        <template>
          <el-table
            :data="_data._table.data"
            class="new-table_border"
            v-loading.lock="_data._table.loadingtable"
            :row-style="tableRowClassName"
            @sort-change="handleSort"
            style="width: 100%">
            <el-table-column
              prop="employeeName"
              label="员工姓名">
              <template slot-scope="scope">
                <div class="scope-title_text">
                  {{scope.row.employeeName|| '-'}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="employeeNumber"
              label="工号">
              <template slot-scope="scope">
                <div class="scope-title_text">
                  {{scope.row.employeeNumber|| '-'}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="employeeMobile"
              label="手机号">
              <template slot-scope="scope">
                <div class="scope-title_text">
                  {{scope.row.employeeMobile|| '-'}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="loginAccount"
              label="线下门店">
              <template slot-scope="scope">
                <div class="scope-name">
                  <div :class="'scope-name_text'" >
                    {{scope.row.offlineShops.join(',')}}
                  </div>
                  <el-popover
                    placement="top-start"
                    class="item"
                    :title="`线下门店（${scope.row.offlineShops.length}）`"
                    width="200"
                    trigger="hover"
                    :content="scope.row.offlineShops.join(',')">
                    <span class="scope-name_tip" slot="reference">共{{scope.row.offlineShops.length}}个</span>
                  </el-popover>
                  <!-- <el-tooltip class="item" effect="light" :content="scope.row.offlineShops.join(',')" placement="top" popper-class='max-popper'>
                    <span class="scope-name_tip">共{{scope.row.offlineShops.length}}个</span>
                  </el-tooltip> -->
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="promotionMasterNumber"
              align='center'
              sortable="custom"
              label="裂变大师人数">
              <template slot-scope="scope">
                <ns-button type='text' @click="handleShowMaster(scope.row, scope.$index)">{{scope.row.promotionMasterNumber}}</ns-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="inviteFriendNumber" align='center'>
              <template slot='header'>
                添加好友总数
                <el-tooltip  effect='light' popper-class='popperClass' placement="top">
                  <Icon type="question-circle"  class='question-circle'/>
                  <template slot='content'>
                    添加该导购为好友的人数
                  </template>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <ns-button type='text' @click="handleShowFriend(scope.row, scope.$index)">{{scope.row.inviteFriendNumber}}</ns-button>
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
  </div>
</template>
<script>
import Detail from './src/Detail'
import PageTable from '@/components/NewUi/PageTable'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
Detail.components = {
  PageTable
}
Detail.mixins = [tableMixin]
export default Detail
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";

</style>
