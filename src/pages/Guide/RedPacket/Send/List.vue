<template>
  <div>
    <page-table title='发红包'>
      <!-- 搜索 start -->
      <template slot='search'>
        <el-form :inline="true" class='form-inline_top'>
          <el-form-item label="使用范围：">
            <NsGuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" :auth="true" type="primary" btnTitle="" dialogTitle="选择员工" v-model="model.guideIds" @input="(value)=>{this.changeSearchfrom({ guideIds: value })}">
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
              label="红包名称">
              <template slot-scope="scope">
                <div class="scope-title">
                  <div class='scope-img'><PreviewRedPacket :bgImage='scope.row.background' :bagTip='scope.row.benediction' :bgHasFont='false'/></div>
                  <div class="scope-title_tab">
                    {{scope.row.name}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="state"
              label="红包类型">
              <template slot-scope="scope">
                {{redpacketTypeMap[scope.row.redpackType]}}
              </template>
            </el-table-column>
            <el-table-column
              prop="money"
              label="单个金额">
              <template slot-scope="scope">
                <template v-if='scope.row.redpackType === normalRed'>
                  {{scope.row.money/100 | moneyStr}}
                </template>
                <template v-else>
                  {{scope.row.moneyMin/100 | moneyStr}} - {{scope.row.moneyMax/100 | moneyStr}}
                </template>
              </template>
            </el-table-column>
            <el-table-column
              prop="remainder"
              :sortable="'custom'"
              label="剩余个数">
            </el-table-column>
            <el-table-column
              align='center'
              label="使用范围">
              <div class="scope-name" slot-scope="scope">
                <template v-if='scope.row.useType === 1'>
                  全部员工
                </template>
                <template v-else>
                  <ns-button type='text'  @click='handlePreview(scope.row.settingId,scope.row.useType)'>{{scope.row.useNum}}{{`${scope.row.useType === 2 ? '家门店': '名员工'}`}}</ns-button>
                </template>
              </div>
            </el-table-column>
            <el-table-column
              align='center'
              width='300px'
              label="红包有效期">
              <template slot-scope="scope">
                <template v-if='scope.row.timeType === timeTypeInterval'>{{scope.row.startTime}}-{{scope.row.endTime}}</template>
                <template v-else>不限</template>
              </template>
            </el-table-column>
            <el-table-column
              align='center'
              label="状态"
              >
              <template slot-scope="scope">
                <el-switch
                  @change='handleChangeState(scope.row.settingId,scope.row.state)'
                  :value="scope.row.state === 1" :class="[state==='QA'?stateQA:stateIcon]">
                </el-switch>
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
    <el-dialog ref="friendsList" :visible.sync="visible"
               :title="chooseItem.useType === 2?'使用门店':'使用员工'"
               width="960px">
      <user-list v-if='visible' ref='employeeTable' :data="chooseItem"></user-list>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="visible = false">关闭</ns-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Index from './src/list'
import PageTable from '@/components/NewUi/PageTablePro'
import NsGuideDialog from '@/components/NsGuideDialog'
import PreviewRedPacket from '../components/PreviewRedPacket'
import UserList from '../components/UserList'
Index.components = {
  PageTable, NsGuideDialog, PreviewRedPacket, UserList
}
export default Index
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.search-icon {
  font-size: 25px;
}
.scope-img {
  min-width: 38.66px;
  max-width: 38.66px;
  margin-right: 15.67px;
}
.scope-title {
  display: flex;
  align-items: center;
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
</style>
<style scoped>
.stateQA.is-checked >>> .el-switch__core{
  border-color: #2153D4;
  background-color: #2153D4;
}
.stateIcon.is-checked >>>.el-switch__core{
  border-color: rgb(0, 145, 250);
  background-color: rgb(0, 145, 250);
}
</style>
