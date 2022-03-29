<template>
  <div class="analysis-container">
    <div class='analysis-header'>
      <h3 class='header-text'>
        <Icon type="icon-fanhuishangyiji" class='back-icon' @click='handleBack'></Icon>
        {{activityName}}的效果分析
      </h3>
       <div class='header-tab' v-if='type === "Group"'>
        <el-tabs v-model="dateValue" @tab-click="handleChangeDateType">
          <el-tab-pane v-for="item in dateList" :label="item.label" :name="item.value" :key="item.value"></el-tab-pane>
        </el-tabs>
        <div class="header-tab_right">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="请选择开始日期"
            end-placeholder="请选择结束日期"
            :default-time="['00:00:00','23:59:59']"
            @change='handleChangeDateValue'
            align="right">
          </el-date-picker>
        </div>
      </div>
    </div>
    <page-table >
      <template slot='nav'>
        <el-row class='tab-ul' :gutter="24">
          <el-col :span='12' :class="activeType === 'shop' && 'active'">
            <div class='tab-li'  @click='handleChangeType("shop")'>
              <div class='tab-li_left'>
                <p class='tab-li_name'>参与门店</p>
                <h3 class='tab-li_value'>{{countData.shop}}</h3>
              </div>
              <div class='tab-li_right'>
                <Icon type="ns-shoper" class='tab-li_icon'></Icon>
              </div>
            </div>
          </el-col>
          <el-col :span='12' :class="{active:activeType === 'employee'}">
            <div class='tab-li'  @click='handleChangeType("employee")'>
              <div class='tab-li_left'>
                <p class='tab-li_name'>
                  {{employeeName}}
                  <el-tooltip v-if='type==="Group"' content="当一个群关联多个门店群聚合码时，新增群成员数会累计，不会进行排重。"  placement="top">
                    <Icon type="question-circle" class='question-circle' />
                  </el-tooltip>
                </p>
                <h3 class='tab-li_value'>{{countData.employee}}</h3>
              </div>
              <div class='tab-li_right employee'>
                <Icon type="ns-group" class='tab-li_icon'></Icon>
              </div>
            </div>
          </el-col>
        </el-row>
      </template>
      <template slot='search'>
        <el-form :inline="true" class='form-inline_top'>
          <el-form-item label="选择门店：">
            <!-- <NsShopDialog :selfBtn='true' :appendToBody='true' :isButton="false" :auth="false" type="icon" btnTitle="" dialogTitle="选择门店" v-model="model.shopIdList" @input="getDataTotal">
              <template slot='btnIcon'>
                <div class='self-btn'>
                  {{(model.shopIdList&&model.shopIdList.length)?`已选择${model.shopIdList.length}个门店`:'全部'}}
                  <Icon type="shop" class='guideIds-icon'></Icon>
                </div>
              </template>
            </NsShopDialog> -->
            <shopSelect @callBack="handleChangeShopList" :hasShopArr="model.shopIdList" shopStatus='1,-1' isDIYBtn penetrate=1>
              <template slot='btnIcon'>
               <div class='self-btn'>
                  {{(model.shopIdList&&model.shopIdList.length)?`已选择${model.shopIdList.length}个门店`:'全部'}}
                  <Icon type="shop" class='guideIds-icon'></Icon>
                </div>
              </template>
            </shopSelect>
          </el-form-item>
          <el-form-item v-if='type === "Group"' label="群码设置状态：" class='el-form__change'>
            <el-select v-model="model.setState" placeholder="请选择" @change='getDataTotal'>
              <el-option
                v-for="item in statusOptionList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="添加时间：" class='el-form__change' v-if='type !== "Group"'>
             <el-date-picker
              v-model="time"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy/MM/dd"
              range-separator="至"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
              :default-time="['00:00:00','23:59:59']"
              @change='screenAddByTime'
              align="right">
          </el-date-picker>
          </el-form-item>
            <el-form-item label="下单时间：" class='el-form__change' v-if='type !== "Group"'>
             <el-date-picker
             v-model="timeOrder"
             type="daterange"
             value-format="yyyy-MM-dd HH:mm:ss"
             format="yyyy/MM/dd"
             range-separator="至"
             start-placeholder="请选择开始日期"
             end-placeholder="请选择结束日期"
             :default-time="['00:00:00','23:59:59']"
             @change='screenOrderByTime'
             align="right">
           </el-date-picker>
          </el-form-item>
          <el-form-item label="退款时间：" class='el-form__change' v-if='type !== "Group"'>
             <el-date-picker
             v-model="timeRefund"
             type="daterange"
             value-format="yyyy-MM-dd HH:mm:ss"
             format="yyyy/MM/dd"
             range-separator="至"
             start-placeholder="请选择开始日期"
             end-placeholder="请选择结束日期"
             :default-time="['00:00:00','23:59:59']"
             @change='screenRefundByTime'
             align="right">
           </el-date-picker>
          </el-form-item>
        </el-form>
      </template>
      <template slot='button'>
        <ns-button  size='large' @click='handleExport'>导出文件</ns-button>
      </template>
      <template slot='table'>
        <div v-if="activeType === 'shop'">
          <template v-if='type === "Group"'>
            <ShopTable :propsModel='model' @onSort='onSort'/>
          </template>
          <template v-else>
            <ShopFriendsTable :propsModel='model'  @onSort='onSort'  />
          </template>
        </div>
        <div v-if="activeType === 'employee'">
          <template v-if='type === "Group"'>
            <EmployeeTable :propsModel='model'  @onSort='onSort'/>
          </template>
          <template v-else>
            <EmployeeFriendsTable :propsModel='model'  @onSort='onSort'/>
          </template>
        </div>
      </template>
    </page-table>
  </div>
</template>
<script>
import Analysis from './src/index'
import PageTable from '@/components/NewUi/PageTable.vue'
import NsShopDialog from '@/components/NsShopDialog'
import ShopTable from './components/ShopTable'
import EmployeeTable from './components/EmployeeTable'
import ShopFriendsTable from './components/ShopFriendsTable'
import EmployeeFriendsTable from './components/EmployeeFriendsTable'
import shopSelect from '../../../components/selectShops'

export default Analysis
Analysis.components = {
  PageTable, NsShopDialog, ShopTable, EmployeeTable, ShopFriendsTable, EmployeeFriendsTable, shopSelect
}
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .analysis-container {
    .back-icon {
      font-size: 16px;
      cursor: pointer;
      margin-right: 16px;
      &:hover {
        color: #0392fb;
      }
    }
    .analysis-header {
      margin: -10px -10px 16px -10px;
      background: #fff;
      display: flex;
      justify-content: space-between;
      padding: 0 16px;
      .header-text {
        font-size: 16px;
        color: #262626;
        height: 48px;
        line-height: 48px;
        display: flex;
        align-items: center;
      }
      .header-tab {
        display: flex;
        align-items: center;
      }
      .header-tab_right {
        height: 32px;
        padding-left:  24px;
        border-left:1px solid #E8E8E8;
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
      color:#8C8C8C;
    }
  }
  .tab-ul {
    margin-bottom: 16px;
    .tab-li {
      height: 96px;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #D9D9D9;
      border-radius: 4px;
      background: #FFFFFF;
      cursor: pointer;
      .tab-li_name {
        font-size: 14px;
        color: #8C8C8C;
        line-height: 22px;
        margin-bottom: 8px;
      }
      .tab-li_value {
        font-size: 24px;
        color: #262626;
        line-height: 32px;
      }
      .tab-li_right {
        height: 48px;
        width: 48px;
        border-radius: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #F2F9FE;
        .tab-li_icon {
          font-size: 24px;
          color: #0091FA;
        }
        &.employee {
          background: #FFF6E6;
          .tab-li_icon {
            color: rgb(244,177,64)
          }
        }
      }
    }
    .active .tab-li{
      background: #F2F9FE;
      border: 1px solid #0094FC;
      .tab-li_name {
        color: #0091FA;
      }
      .tab-li_value {
        color: #0091FA;
      }
      .tab-li_right {
        background: #FFFFFF;
      }
    }
  }
</style>
<style scoped>
.header-tab {
  >>> .el-tabs__item {
    box-sizing: content-box;
    display: inline-block;
    padding: 8px 0;
    height: 32px;
    line-height: 32px;
    width: 82px;
    text-align: center;
    font-size: 14px;
    color: #262626;
    font-weight: normal;
    &.is-active {
      color:#0094FC;
    }
  }
  >>> .el-tabs__header {
    border-bottom: none;
  }
}
.template-table >>> .template-table__bar-base {
    margin-bottom: 0;
  }
</style>
