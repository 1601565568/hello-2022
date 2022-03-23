<template>
  <div class='analysis'>
    <div class='analysis-content'>
      <el-form :inline="true" class='form-inline_top'>
        <el-form-item label="支付商户号：" class='el-form__change no-margin'>
          <el-select v-model="model.payConfigId" placeholder="请选择" @change='handleChangePay'>
            <el-option
              v-for="item in payList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="选择员工：" class='el-form__change no-margin has-left'>
          <NsGuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" :auth="true" type="primary" btnTitle="" dialogTitle="选择员工" v-model="model.guideIds" @input="handleChangeGuide">
            <template slot='selfBtn'>
              <div class='self-btn'>
                {{(model.guideIds&&model.guideIds.length)?`已选择${model.guideIds.length}个员工`:'全部'}}
                <Icon type="geren" class='guideIds-icon'></Icon>
              </div>
            </template>
          </NsGuideDialog>
        </el-form-item> -->
        <el-form-item :label="cloudPlatformType == 'ecrp'?'选择员工：':'选择企业微信成员：'" class='el-form__change no-margin has-left'>
          <NsGuideDialog :selfBtn='true'
                         :appendToBody='true'
                         :isButton="false"
                         :auth="true"
                         btnTitle=""
                         :dialogTitle="选择员工"
                         v-model="model.guideIds"
                         @input="handleChangeGuide"
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
                               @input="handleChangeGuide"
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
      </el-form>
    </div>
    <div class='analysis-content'>
      <h3>出入账统计</h3>
      <ColorfulDisplay :dataList='dataList'/>
    </div>
    <div class='analysis-content form-inline_top'>
      <div class='flex-box align-top'>
        <DatePickerBar :clear='false' ref='datePickerBar' :dateList='dateList' :defaultPickDay='defaultPickDay' @change='handleChangeDate' :pickerOptions='pickerOptions'/>
        <ns-button @click='handleExport(model)'>导出文件</ns-button>
      </div>
    <!-- </div>
    <div class='analysis-content'> -->
      <h3 class='double-title'>数据分析</h3>
      <!-- <div class='flex-box align-top'><h3 >数据分析</h3><ns-button @click='handleExport(model)'>导出CSV文件</ns-button>
      </div> -->
      <business-echarts :options="saleOption" class="oscillogram" auto-resize></business-echarts>
      <h3 class='double-title'>数据报表</h3>
      <div class="select-data-view" :class="[fuscous==='QA'?fuscousQA:fuscousIcon]">
        <el-tabs v-model="activeName">
          <el-tab-pane label="按日期统计" name="date">
            <TableByDate ref='TableByDate' :url='url' :data='model'/>
          </el-tab-pane>
          <el-tab-pane :label="cloudPlatformType==='ecrp'?'按员工统计':'按企业微信成员'" name="guide">
            <TableByGuide ref='TableByGuide' :url='urlByGuide' :data='model'/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import Index from './src/index'
import ColorfulDisplay from '../components/ColorfulDisplay'
import TableByDate from '../components/TableByDate'
import TableByGuide from '../components/TableByGuide'
import DatePickerBar from '@/components/NewUi/DatePickerBar'
import businessEcharts from '@nascent/ecrp-ecrm/src/components/NsEcharts'
import NsGuideDialog from '@/components/NsGuideDialog'
import NsGuideWeChatDialog from '@/components/NsGuideWeChatDialog'
export default Index
Index.components = {
  ColorfulDisplay, DatePickerBar, businessEcharts, NsGuideDialog, TableByDate, TableByGuide, NsGuideWeChatDialog
}
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
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
.select-data-view {
  margin-left: -16px;
}
</style>
<style scoped>
.analysis >>> .el-form-item.el-form__change.no-margin {
  margin-bottom: 0px;
}
.analysis >>> .el-form-item.el-form__change.has-left {
  margin-left: 16px !important;
}
.align-top {
  align-items: flex-start;
}
.template-table__pagination {
  box-shadow: none !important;
}
.select-data-view >>> .el-tabs__header {
  border: none;
}

.select-data-view >>> .el-tabs__item.is-active {
  color: #0094fc;
}

.select-data-view >>> .el-tabs__active-bar {
  background: #0094fc;
}

.select-data-view >>> .el-tabs__item:focus.is-active.is-focus:not(:active) {
  box-shadow: none;
}
.double-title {
  margin-top: 40px;
}
.analysis-content >>> .date-picker-bar {
  margin-left: 0;
}
</style>
