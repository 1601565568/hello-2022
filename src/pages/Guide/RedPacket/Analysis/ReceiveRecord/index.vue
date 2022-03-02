<template>
  <div>
    <page-table title='领取记录'>
      <!-- 搜索 start -->
      <template slot='search'>
        <el-form :inline="true" class='form-inline_top'>
          <el-form-item label="支付商户号：" class='el-form__change'>
            <el-select v-model="model.payConfigId" placeholder="请选择" @change='(value)=>{changeSearchfrom({payConfigId:value})}'>
              <el-option
                v-for="item in payList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="红包类型：">
            <el-select v-model="model.redpackType" placeholder="请选择" @change='(value)=>{changeSearchfrom({redpackType:value})}'>
              <el-option
                v-for="item in redpacketTypeListSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="领取时间：" class='el-form__change'>
            <el-date-picker
              v-model="seachDate"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              popper-class='date-filter'
              :clearable='false'
              range-separator="至"
              :picker-options="pickerOptions"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
              :default-time="['00:00:00','23:59:59']"
              align="right">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发放类型：" class='el-form__change'>
            <el-select v-model="model.launchType" placeholder="请选择" @change='(value)=>{changeSearchfrom({launchType:value})}'>
              <el-option
                v-for="item in setTypeListSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="发放人：" class='el-form__change'>
            <NsGuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" :auth="false" type="primary" btnTitle="" dialogTitle="选择员工" v-model="model.guideIds" @input="(value)=>{changeSearchfrom({guideIds:value})}">
              <template slot='selfBtn'>
                <div class='self-btn'>
                  {{(model.guideIds&&model.guideIds.length)?`已选择${model.guideIds.length}个员工`:'全部'}}
                  <Icon type="geren" class='guideIds-icon'></Icon>
                </div>
              </template>
            </NsGuideDialog>
          </el-form-item> -->
        <el-form-item :label="cloudPlatformType == 'ecrp'?'发放人：':'发放成员：'" class='el-form__change'>
          <NsGuideDialog :selfBtn='true'
                         :appendToBody='true'
                         :isButton="false"
                         :auth="true"
                         btnTitle=""
                         :dialogTitle="选择员工"
                         v-model="model.guideIds"
                         @input="(value)=>{changeSearchfrom({guideIds:value})}"
                         :isOpenDialogAfterRequest='false'
                         v-if="cloudPlatformType == 'ecrp'">
            <template slot='selfBtn'>
              <div class='self-btn'>
                {{(model.guideIds&&model.guideIds.length)?`已选择${model.guideIds.length}个员工`:'全部'}}
                <Icon type="geren"
                      class='guideIds-icon'></Icon>
              </div>
            </template>
          </NsGuideDialog>
          <NsGuideWeChatDialog :selfBtn='true'
                               :appendToBody='true'
                               :isButton="false"
                               :auth="true"
                               :switchAreaFlag="1"
                               btnTitle=""
                               dialogTitle="选择企业微信成员"
                               v-model="model.guideIds"
                               @input="(value)=>{changeSearchfrom({guideIds:value})}"
                               :isOpenDialogAfterRequest='false'
                               v-else>
            <template slot='selfBtn'>
              <div class='self-btn'>
                {{(model.guideIds&&model.guideIds.length)?`已选择${model.guideIds.length}个成员`:'全部'}}
                <Icon type="geren"
                      class='guideIds-icon'></Icon>
              </div>
            </template>
          </NsGuideWeChatDialog>
        </el-form-item>
          <el-form-item label="">
            <el-input v-model.trim="model.customerNick" placeholder="请输入客户昵称"  @keyup.enter.native="changeSearchfrom" style='width:228px;'>
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="changeSearchfrom"></Icon>
            </el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot='button'>
        <!-- <ns-button size='large' @click='handleExport(model)'>导出文件</ns-button> -->
        <ns-button size='large' @click='handleExcelExport(model)'>导出文件</ns-button>
      </template>
      <!-- 搜索 end -->
      <!-- 表格 start -->
      <template slot='table'>
        <template>
          <el-table
            :data="_data._table.data"
            class="new-table_border"
            v-loading.lock="_data._table.loadingtable"
            style="width: 100%">
            <el-table-column
              prop="nickname"
              label="领取人">
            </el-table-column>
            <el-table-column
              prop="state"
              label="发放类型">
              <template slot-scope="scope">
                {{setTypeMap[scope.row.launchType]}}
              </template>
            </el-table-column>
            <el-table-column
              prop="total"
              label="领取金额（元）">
              <template slot-scope="scope">
                <template>
                  {{scope.row.money/100 | moneyStr}}
                </template>
              </template>
            </el-table-column>
            <el-table-column
              prop="payTime"
              label="领取时间">
            </el-table-column>
            <el-table-column
              prop="redpackName"
              label="红包名称">
            </el-table-column>
            <el-table-column
              prop="mchMsg"
              label="支付商户号">
            </el-table-column>
            <el-table-column
              prop="redpackType"
              label="红包类型">
              <template slot-scope="scope">
                {{redpacketTypeMap[scope.row.redpackType]}}
              </template>
            </el-table-column>
            <el-table-column
              prop="sendName"
              :label="cloudPlatformType==='ecrp'?'发放人':'发放成员'">
            </el-table-column>
            <el-table-column
              prop="workNumber"
              label="工号" v-if="cloudPlatformType==='ecrp'">
              <template slot-scope="scope">
                {{scope.row.workNumber || '-'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="shopNames"
              show-overflow-tooltip
              label="工作门店" v-if="cloudPlatformType==='ecrp'">
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
import Index from './src/index'
import PageTable from '@/components/NewUi/PageTablePro'
import NsGuideDialog from '@/components/NsGuideDialog'
import NsGuideWeChatDialog from '@/components/NsGuideWeChatDialog'
Index.components = {
  PageTable, NsGuideDialog, NsGuideWeChatDialog
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
</style>
