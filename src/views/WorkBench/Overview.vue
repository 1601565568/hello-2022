<template>
  <div class="overview-content">
    <el-row class="overview-content__grid" :gutter="10">
      <el-col :span="6">
        <div class='overview-content__item'>
            <div class="c-change" style='height:61px;text-align：center;padding-top:20px;padding-left:20px'>

            <el-date-picker
              @change='change'
              v-model="searchObj.monthDate"
              type="month"
              placeholder="选择月"
              popper-class='selectMonthPicker'
              >
            </el-date-picker>
            </div>
            <div class='el-card-body date'>
              <el-select v-model="searchObj.id" filterable placeholder="请选择门店" @change='shopSelect(searchObj.id)'>
              <el-option
                v-for="(item,index) in shopArr"
                :key="item.id"
                :label="item.shopName"
                :value="item.id">
              </el-option>
            </el-select>
            </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class='overview-content__item'>
          <p class='el-card-tit'>销售额</p>
          <div class='el-card-body clearfix'>
            <span class='el-card-num float-left'>+{{getRewardInfoObj.payment||'0.00'}}</span>
            <el-progress type="circle" :percentage="getRewardInfoObj.paymentPersent" :width='90' color='#0091FA' class='float-right'></el-progress>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class='overview-content__item'>
          <p class='el-card-tit'>招募会员</p>
          <div class='el-card-body clearfix'>
            <span class='el-card-num float-left' >+{{getRewardInfoObj.memberCount || '0.00'}}</span>
            <el-progress type="circle" :percentage="getRewardInfoObj.memberCountPersent" :width='90' color='#50D065' class='float-right'></el-progress>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class='overview-content__item'>
          <div class='el-card-tit'>
            <p class='el-card-tit-one'>导购提成奖励</p>
            <p class='el-card-tit-two'>{{getRewardInfoObj.reward !=null? '¥' + getRewardInfoObj.reward :''}}</p>
          </div>

          <div class='el-card-body clearfix'>
              <el-row  :gutter="5">
                <el-col :span="9">
                  <p class='el-card-body-tit'>销售提成</p>
                  <p class='el-card-body-num'>{{getRewardInfoObj.sellReward ?  getRewardInfoObj.sellReward :'0.00'}}</p>
                </el-col>
                <el-col :span="6">
                  <p class='el-card-body-add'>+</p>
                </el-col>
                <el-col :span="9">
                  <p class='el-card-body-tit'>招募会员</p>
                  <p class='el-card-body-num'>{{getRewardInfoObj.recruitReward ? getRewardInfoObj.recruitReward :'0.00'}}</p>
                </el-col>
              </el-row>
          </div>
        </div>
      </el-col>

    </el-row>
    <el-row class='overview-content__mid':gutter="10" style='margin-top:10px'>
      <!-- <el-col :span="6" >
        <div class='overview-content__mid-item bg-white'>
          <p class='subtitle'>常用功能</p>
          <div class="mid-item-btn" style='height:400px'>
            <div class="flex flex-between">
              <router-link class="list-area" :to="{ name: 'GUIDE_TASK'}">
                <ns-button type='primary'>任务管理</ns-button>
              </router-link>
              <router-link class="list-area" :to="{ name: 'ACTIVITY_INDEX_SHOP_SETLIST'}">
                <ns-button type='primary'>指标管理</ns-button>
              </router-link>
              <router-link class="list-area" :to="{ name: 'YGGL'}">
                <ns-button type='primary'>员工离职</ns-button>
              </router-link>
            </div>
            <div class="flex flex-between">
              <router-link class="list-area" :to="{ name: 'KQGL'}">
                <ns-button type='primary'>卡券管理</ns-button>
              </router-link>
            </div>
          </div>
        </div>
       </el-col> -->
       <el-col :span="6" >
        <div class='overview-content__mid-item bg-white'>
          <p class='subtitle'>销售
            <span class='subtitle-abs top5'>TOP5</span>
            <!-- <span class='subtitle-abs all'>查看所有</span> -->
          </p>
          <div class="mid-item-ul" style='height:400px'>
            <div class="" v-if='!guideSellRankingArr.length'>
              <ns-no-data>暂无销售数据</ns-no-data>
            </div>
            <div class="mid-item-li flex flex-between" v-for="(item,index) in guideSellRankingArr">
              <span>{{index}}. {{item.name}}<i style='color:#909399;font-style:normal'>（{{item.shopName}}）</i></span>
              <span style='color:#909399'>{{item.perf_all}}</span>
            </div>
          </div>
        </div>
       </el-col>
      <el-col :span="18" class='overview-content__mid-item'>
        <div class='overview-content__mid-item bg-white'>
          <p class='subtitle'>销售业绩</p>
        </div>
        <div style='background-color:#ffffff'>
          <business-echarts :options="sellOption" class="oscillogram" auto-resize></business-echarts>
        </div>
      </el-col>
    </el-row>
    <!-- <el-row class='overview-content__mid':gutter="16">
      <el-col :span="6" >
        <div class='overview-content__mid-item bg-white'>
          <p class='subtitle'>销售
            <span class='subtitle-abs top5'>TOP5</span>
            <span class='subtitle-abs all'>查看所有</span>
          </p>
          <div class="mid-item-ul" style='height:250px'>
            <div class="" v-if='!guideSellRankingArr.length'>
              <ns-no-data>暂无销售数据</ns-no-data>
            </div>
            <div class="mid-item-li flex flex-between" v-for="(item,index) in guideSellRankingArr">
              <span>{{index}}. {{item.name}}<i style='color:#909399;font-style:normal'>（{{item.shopName}}）</i></span>
              <span style='color:#909399'>{{item.perf_all}}</span>
            </div>
          </div>
        </div>
       </el-col>
      <el-col :span="18" class='overview-content__mid-item'>
        <div class='overview-content__mid-item bg-white'>
          <p class='subtitle'>门店销售TOP5</p>
        </div>
        <div  class='bot-map flex ' >
          <div class="map-echart">
              <business-echarts :options="mapOption" class="oscillogram" auto-resize style='height:250px'></business-echarts>
          </div>
          <div class="map-card">
            <span class="map-card-tit">{{findShopSellRankingArr[0] && findShopSellRankingArr[0].shopName}}</span>
            <span class="map-card-sell">销售额：{{findShopSellRankingArr[0] ? findShopSellRankingArr[0].payment : 0}}</span>
            <span class="map-card-rec">招募会员:{{findShopSellRankingArr[0] ? findShopSellRankingArr[0].member_count : 0}}</span>
          </div>
          <div class="map-list">
            <div class="map-item" v-for='(item, index) in findShopSellRankingArr' :key='index'>
              <div class="map-item-title">{{item.shopName}}</div>
              <div class="map-item-progress" v-if='item.shopName'>
                <el-progress :percentage="item.per" color="#8e71c7"></el-progress>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row> -->
    <!-- <el-row class="overview-content__echart" :gutter="5">
      <el-col :span="12">
       <div v-loading.lock="loadingSale"
               :element-loading-text="$t('prompt.loading')">
            <div class="no-data" v-if="!isSaleData">
            </div>
            <template>
              <business-echarts :options="option" class="oscillogram" auto-resize></business-echarts>
            </template>

          </div>
      </el-col>

    </el-row> -->
  </div>
</template>
<script>
  import index from './src/index.js'
  export default index
</script>
<style scoped lang='scss'>
  @import "../../style/small/variables.pcss";
  .selectMonthPicker{
    width: 100px
  }
  .subtitle{
    font-size: 14px;
    line-height: 20px;
    color: #606266;
    padding: 20px 20px;
    border-bottom:1px solid #D8D8D8;
    position: relative;
    .subtitle-abs{
      position: relative;
      top: 1px;
      &.top5{
        font-size: 14px;
        color: #606266;
        line-height: 20px;
        left: 20px;
        bottom: 0px
      }
      &.all{
        font-size: 12px;
        color: #0091FA;
        line-height: 17px;
        right: 20px;
        top:22px;
      }
    }
  }
  .bot-map{
    background-color:#ffffff;
    // padding: 16px 0 17px 20px;
    .map-echart{
      width:43%;
    }
    .map-card{
      padding: 56px 0;
      width: 18%;
      border: 1px solid #DCDFE6;
      border-radius: 3px;
      margin: 0 64px 0 50px;
      .map-card-tit,.map-card-sell,.map-card-rec{
        display: block;
        text-align:center;
      }
      .map-card-tit{
        font-size: 28px;
        color: #0292FB;
        line-height: 40px;
      }
      .map-card-sell,.map-card-rec{
        font-size: 13px;
        color: #33393E;
        line-height: 18px;
      }
      .map-card-sell{
        margin: 30px 0 7px 0
      }
    }
    .map-list{
      flex:1
    }
  }
  .bot-map .eharts{
    height: 265px;
  }
  .bg-white{
    background: #ffffff
  }
  .overview-content__mid{
    .mid-item-btn{
      height: 352px;
      padding: 20px 16px 0 16px;
      >div{
        margin-bottom: 15px;
      }
    }
    .mid-item-ul{
      .mid-item-li{
        padding: 15px 20px;
        color: #606266;
        font-size: 14px;
        line-height: 20px;
        border-bottom:1px solid #D8D8D8;
      }
      .mid-item-li:last-child{
        border:none
      }
    }
  }
  .overview-content__item{
    background: #ffffff;
    .el-card-tit {
      font-size: 14px;
      line-height: 20px;
      color: #606266;
      padding: 20px 20px;
      border-bottom:1px solid #D8D8D8;
      .el-card-tit-one{
        text-align: center;
      }
      .el-card-tit-two{
        color: #33393E;
        font-weight:blod;
        line-height:28px;
        margin-top:10px;
        font-size: 28px;
        text-align: center;
        height: 28px;
      }
    }
    .el-card-body{
      padding: 16px 20px;
      &.date{
        padding: 0 20px;
        padding-top: 29px;
        height: 122px;
      }
      .el-select{
        width: 100%;
      }
      .el-card-num{
        font-size: 24px;
        color: #151B00;
        line-height: 90px;
      }
      .el-card-body-tit{
        color: #909399;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
      }
      .el-card-body-num{
        color: #33393E;
        font-size: 14px;
        font-weight: bold;
        line-height: 20px;
        text-align: center;
        margin-top:12px;
      }
      .el-card-body-add{
        font-size: 30px;
        color: #33393E;
        line-height: 52px;
        text-align: center;
      }
    }
  }
  @component-namespace overview {
    @b content {
      .el-row {
        & + .el-row {
          margin-top: var(--default-margin-base);
        }
        > .el-col {
          /*box-shadow: var(--default-box-shadow-base);*/
        }
      }
      @e grid {
        margin-bottom: var(--default-margin-base);
        @b content {
          @e item {

            .el-card__body {
              position: relative;
              .overview-content__item-left {
                margin-right: 65px;
                span {
                  font-weight: bold;
                }
                p {
                  padding-top: 6px;
                }
              }
              .overview-content__item-right {
                position: absolute;
                top: 50%;
                right: 20px;
                margin-top: -30px;
                width: 60px;
                height: 60px;
                img {
                  width: 60px;
                  height: 60px;
                }
              }
            }
          }
        }
        .el-col {
          &:first-child {
            .overview-content__item:before {
              background: var(--theme-color-primary);
            }
          }
          &:nth-child(2) {
            .overview-content__item:before {
              background: var(--theme-color-success);
            }
          }
          &:nth-child(3) {
            .overview-content__item:before {
              background: var(--theme-color-warning);
            }
          }
          &:nth-child(4) {
            .overview-content__item:before {
              background: var(--theme-color-danger);
            }
          }
        }
      }
      @e title {
        line-height: 30px;
        padding: var(--default-padding-base) var(--default-padding-base) var(--default-padding-base) 0;
        >span {
          position: relative;
          display: inline-block;
          line-height: 1;
          padding: 0 0 0 var(--default-padding-larger);
          &:before {
            content: " ";
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 4px;
            background-color: var(--theme-color-primary);
          }
        }
        .el-radio-group {
          padding: 3px;
          .el-radio-button__inner {
            padding: var(--default-padding-base) var(--default-padding-larger);
          }
        }
      }
      @e echart {
        @b echart {
          @e item {
            background-color: var(--theme-color-white);
            border-radius: var(--default-radius-mini);
            overflow: hidden;
            .el-form {
              padding: var(--default-padding-base);
              .el-form-item {
                margin: 0;
              }
              .spacing-button {
                display: block;
                margin-top: var(--default-margin-larger);
                text-align: center;
                .el-radio-button {
                  margin: 0 var(--default-margin-larger);
                  .el-radio-button__inner {
                    padding: var(--default-padding-base) var(--default-padding-larger);
                    border-radius: var(--default-radius-mini);
                    border: 1px solid var(--theme-base-border-color-primary);
                    box-shadow: none;
                  }
                }
              }
            }
            .echarts {
              padding-left: var(--default-padding-larger);
              width: 100%;
            }
            .no-data {
              width: 100%;
              height: 360px;
              background: url("data:image/png;base64,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") center center no-repeat;
            }
          }
        }
        .el-col {
          .echarts {
            height: 360px;
          }
        }
      }
      @e activity {
        @b activity {
          @e item {
            background-color: var(--theme-color-white);
            border-radius: var(--default-radius-mini);
            overflow: hidden;
            .el-calendar {
              border: none;
              margin: 0;
              .el-calendar-table td {
                border-top: 1px solid var(--theme-base-border-color-primary);
                border-left: 1px solid var(--theme-base-border-color-primary);
              }
              .el-calendar-table td:last-child {
                border-right: 1px solid var(--theme-base-border-color-primary);
              }
              .el-calendar-table tr:last-child td {
                border-bottom: 1px solid var(--theme-base-border-color-primary);
              }
              .el-calendar__header {
                display: none;
              }
              .el-calendar-table {
                tbody tr:first-child {
                  display: none;
                }
              }
              .el-calendar-table td.current:not(.disabled) .el-calendar__date, .el-calendar-table td.end-date .el-calendar__date, .el-calendar-table td.start-date .el-calendar__date {
                background-color: transparent!important;
              }
              .el-calendar .el-calendar-table td.today:after, .el-calendar .el-calendar-table td.today:before, .el-calendar .el-calendar-table td.today {
                border-color: var(--theme-color-danger)!important;
              }
              .el-calendar-table td.today {
                background-color:var(--theme-color-danger)!important;
              }
              .el-calendar__date .date-almanac {
                color: var(--theme-color-white);
              }
              .el-calendar-table td.current:not(.disabled) .el-calendar__date-value, .el-calendar-table td.end-date .el-calendar__date-value, .el-calendar-table td.start-date .el-calendar__date-value, .el-calendar-table td.today .el-calendar__date-value {
                color: var(--theme-color-white);
              }
              .el-calendar__date {
                position: relative;
                height: 50px;
                padding: var(--default-padding-small);
                .el-calendar__date-value {
                  position: absolute;
                  top:0;
                  left:0;
                  right:0;
                  padding: var(--default-padding-small);
                  z-index: 2;
                }
                .name-day {
                  position: absolute;
                  top: 1px;
                  left: 1px;
                  right:0;
                  padding: var(--default-padding-small);
                  text-align: left;
                  color: var(--theme-color-white);
                  z-index: 3;
                }
                .overview-list__status {
                  position: absolute;
                  top: -1px;
                  left: 0;
                  right: 0;
                  bottom: -1px;
                  padding-top: 25px;
                  background-color: var(--theme-color-primary);
                  .name {
                    color: var(--theme-color-white);
                  }
                }
              }
              .el-calendar__date {
                margin: 0;
                padding: var(--default-padding-small);
                border-top: transparent;
              }
              .el-calendar__date-content, .el-calendar__date-scroll {
                height: 20px;
              }
            }
          }
        }
        @b area {
          @e item {
            background-color: var(--theme-color-white);
            border-radius: var(--default-radius-mini);
            overflow: hidden;
            .overview-area__content {
              padding: 28px 8% 0;
            }
            .list-area {
              display: inline-block;
              width: 24%;
              padding: 0 0 38px;
              position:relative;
              text-align: center;
              img {
                display: inline-block;
                width: 40px;
                height: 40px;
              }
              span {
                color: var(--theme-font-color-primary);
                font-size: var(--default-font-size-small);
                display: block;
                margin: 0 auto;
                text-align: center;
              }
              label {
                display: block;
                position: absolute;
                top: -5px;
                left: 54%;
                width: 15px;
                height: 15px;
                font-size: var(--default-font-size-small);
                color: var(--theme-color-white);
                border-radius: 50%;
                line-height: 15px;
                background: var(--theme-color-danger);
                text-align: center;
              }
            }
          }
        }
      }
    }
  }

  .overview-popover {
    .el-col {
      margin: 2px 0;
    }
  }

  .overview-list__popover.el-popover {
    padding: 0;
    border: 0;
    .overview-list__popover-header {
      padding: var(--default-padding-base);
      background: var(--theme-color-primary);
      line-height: 20px;
      font-size: var(--default-font-size-small);
      color: var(--theme-color-white);
      i {
        float: right;
        font-size: 16px;
        margin-top: 2px;
        cursor: pointer;
      }
    }
  }

  .overview-list__collapse .el-collapse-item__header {
    font-size: var(--default-font-size-small);
    height: 36px;
    line-height: 36px;
    padding: 0 var(--default-padding-base);
    b {
      font-weight: 400;
      color: var(--theme-color-primary);
      margin-right: var(--default-margin-base);
    }
  }

  .overview-list__collapse .el-collapse-item__arrow {
    line-height: 36px
  }

  .overview-list__collapse .el-collapse-item__content {
    padding: var(--default-padding-base);
  }

  .overview-list__badge {
    position: relative;
    height: 15px;
    >span {
      position: absolute;
      top: -15px;
      left: 50%;
      transform: translate(-50%);
      -webkit-transform: translate(-50%);
      -moz-transform: translate(-50%);
      background-color: var(--theme-color-primary);
      color: var(--theme-color-white);
      border-radius: 100%;
      font-size: 16px;
      display: inline-block;
      width: 32px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      b {
        font-size: var(--default-font-size-small);
        font-weight: 400
      }
    }
  }

  .overview-list__article {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 20px;
    font-size: var(--default-font-size-small);
    color: var(--theme-font-color-primary);
    cursor: pointer
  }

  .overview-list__status-list {
    margin-top: 2px;
    span.item {
      float: left;
      width: 100%;
      text-align: center;
      color: var(--theme-font-color-primary);
      .name {
        display: block;
        font-size: var(--default-font-size-small);
        color: var(--theme-font-color-primary);
      }
      .num {
        font-weight: bold;
        font-size: var(--default-font-size-base);
      }
    }
  }

</style>
<style>
  .c-change .el-input__inner{
    padding-left: 30px !important;
  }
</style>