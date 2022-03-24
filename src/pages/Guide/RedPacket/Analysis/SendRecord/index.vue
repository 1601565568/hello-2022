<template>
  <div class='analysis'>
    <div class='analysis-content'>
      <el-form :inline="true" class='form-inline_top'>
        <el-form-item label="支付商户号：" class='el-form__change no-margin'>
          <el-select v-model="model.payConfigId" placeholder="请选择" @change='handleChange'>
            <el-option
              v-for="item in payList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class='analysis-content'>
      <h3>红包发放统计</h3>
      <ColorfulDisplay :dataList='dataList'/>
    </div>
    <div class='analysis-content'>
      <h3>红包发放明细</h3>
      <el-row class="template-table__bar-base">
        <!-- 搜索条件-->
        <el-col :span='21' class="search-content">
          <el-form :inline="true" class='form-inline_top'>
            <el-form-item label="">
              <el-input v-model.trim="model.redpackName" placeholder="请输入红包名称"  @keyup.enter.native="changeSearchfrom" style='width:228px;'>
                <Icon type="ns-search" slot="suffix" class='search-icon' @click="changeSearchfrom"></Icon>
              </el-input>
            </el-form-item>
            <el-form-item label="发放类型：">
              <el-select v-model="model.launchType" placeholder="请选择" @change='(value)=>{changeSearchfrom({launchType:value})}'>
                <el-option
                  v-for="item in setTypeListSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="发放人：">
              <NsGuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" :auth="false" type="primary" btnTitle="" dialogTitle="选择员工" v-model="model.guideIds" @input="(value)=>{changeSearchfrom({guideIds:value})}">
                <template slot='selfBtn'>
                  <div class='self-btn'>
                    {{(model.guideIds&&model.guideIds.length)?`已选择${model.guideIds.length}个员工`:'全部'}}
                    <Icon type="geren" class='guideIds-icon'></Icon>
                  </div>
                </template>
              </NsGuideDialog>
            </el-form-item> -->
        <el-form-item :label="cloudPlatformType == 'ecrp'?'发放人：':'发放成员：'">
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
            <el-form-item label="有效期：" class='el-form__change'>
              <el-date-picker
                v-model="seachDate"
                type="datetimerange"
                popper-class='date-filter'
                :clearable='false'
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="请选择开始日期"
                end-placeholder="请选择结束日期"
                :default-time="['00:00:00','23:59:59']"
                align="right">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- 按钮-->
        <el-col :span='3' class="btn-content">
          <!-- <ns-button size='large' @click='handleExport(model)'>导出文件</ns-button> -->
          <ns-button size='large' @click='handleExcelExport(model)' id="exportButton">导出文件</ns-button>
        </el-col>
      </el-row>
    </div>
    <div class='analysis-content'>
      <el-table
        :data="_data._table.data"
        v-loading.lock="_data._table.loadingtable"
        class="new-table_border"
        style="width: 100%">
        <el-table-column
          prop="sendName"
          :label="cloudPlatformType == 'ecrp'?'发放人':'发放成员'">
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
        <el-table-column
          prop="state"
          label="发放类型">
          <template slot-scope="scope">
            {{setTypeMap[scope.row.launchType]}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="发送时间">
        </el-table-column>
        <el-table-column
          prop="redpackType"
          label="红包类型">
          <template slot-scope="scope">
            {{redpacketTypeMap[scope.row.redpackType]}}
          </template>
        </el-table-column>
        <el-table-column
          prop="mchMsg"
          label="支付商户号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="红包名称">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
          <template slot-scope="scope">
            {{scope.row.remark || '-'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="redpackName"
          label="发放红包金额（元）">
          <template slot-scope="scope">
            {{scope.row.money/100 | moneyStr}}
          </template>
        </el-table-column>
        <el-table-column
          prop="redpackName"
          label="领取成功金额（元）">
          <template slot-scope="scope">
            <template>
              {{scope.row.takeMoney/100 | moneyStr}}
            </template>
          </template>
        </el-table-column>
        <el-table-column
              prop="address"
              label="操作">
              <template slot-scope="scope">
                <ns-button type="text" @click='handlePreview(scope.row.id)'>领取详情</ns-button>
              </template>
            </el-table-column>
      </el-table>
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
    </div>
    <el-drawer
      title="我是标题"
      :modal='false'
      size='50%'
      @close='changeDrawer(false)'
      append-to-body
      :visible.sync="drawer"
      :with-header="false">
      <DetailDrawer v-if='drawer' :id='activeId' @onClose='changeDrawer(false)' />
    </el-drawer>
  </div>
</template>
<script>
import Index from './src/index'
import ColorfulDisplay from '../components/ColorfulDisplay'
import DetailDrawer from '../components/DetailDrawer'
import DatePickerBar from '@/components/NewUi/DatePickerBar'
import NsGuideDialog from '@/components/NsGuideDialog'
import ElDrawer from '@nascent/nui/lib/drawer'
import NsGuideWeChatDialog from '@/components/NsGuideWeChatDialog'
export default Index
Index.components = {
  ColorfulDisplay, DatePickerBar, NsGuideDialog, ElDrawer, DetailDrawer, NsGuideWeChatDialog
}
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.search-icon {
  font-size: 25px;
}
.analysis {
  .analysis-content {
    padding: 16px;
    background: #fff;
    border-radius: 4px;
    margin-top: 16px;
    h3 {
      font-size: 16px;
      color: #262626;
      line-height: 24px;
      font-weight: 500;
      margin-bottom: 16px;
    }
  }
}
.template-table__bar-base {
  padding: 0;
  box-shadow: none;
  display: flex;
  justify-content: space-between;
  .search-content {
    display: flex;
    justify-content: flex-start;
  }
  .btn-content {
    display: flex;
    justify-content: flex-end;
    height: 100%;
    align-items: flex-start;
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
<style scoped>
.analysis >>> .el-form-item.el-form__change.no-margin {
  margin-bottom: 0px;
}
.align-top {
  align-items: flex-start;
}
.template-table__pagination {
  box-shadow: none !important;
}
</style>
