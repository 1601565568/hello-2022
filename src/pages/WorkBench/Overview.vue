<template>
  <!--商城首页Demo-->
  <div class="overview-content">
      <el-row class="overview-content__grid" :gutter="5">
        <el-col :span="4">
          <el-card class="overview-content__item" shadow="never">
              <div class="overview-content__item--select overview-content__item--time">
                时间：
                <el-date-picker
                  @change='change'
                  type="month"
                  v-model="searchObj.monthDate"
                  placeholder="选择月"
                  :clearable="false"
                >
                </el-date-picker>
              </div>
              <div class="overview-content__item--select overview-content__item--store">
                门店：
<!--                <el-select v-model="searchObj.id" filterable clearable placeholder="请选择门店" @change='shopSelect(searchObj.id)'>-->
<!--                  <el-option-->
<!--                    v-for="(item) in shopArr"-->
<!--                    :key="item.id"-->
<!--                    :label="item.shopName"-->
<!--                    :value="item.id">-->
<!--                  </el-option>-->
<!--                  </el-select>-->
                <shop-select-load v-model="searchObj.id"
                                  @change='shopSelect(searchObj.id)'
                                  :insertList='inserList'/>
              </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card class="overview-content__item" shadow="never">
            <div class="overview-content__item-left">
              <p class="text-secondary">
                <span>销售金额 </span>
                <el-tooltip content="销售额=订单总额-退款总额（订单总额为全渠道订单中成单、提货、发货门店为所选门店，且所有交易成功的订单）">
                  <Icon type="question-circle"></Icon>
                </el-tooltip>
              </p>
              <p>
                <span class="font-size-large">￥</span>
                <span class="font-size-large">{{$numeral(getRewardInfoObj.payment).format('0,0.00')}}</span>
                <!-- <el-countup
                  class="font-size-large"
                  :start="0"
                  :end="getRewardInfoObj.payment||0"
                  :duration="1.5"
                  :decimal="2">
                </el-countup> -->
              </p>
            </div>
            <div class="overview-content__item-right">
              <el-popover
                  placement="top-start"
                  trigger="hover"
                  :content="'完成度：'+getRewardInfoObj.paymentPersent+'% , 销售目标：'+ $numeral(getRewardInfoObj.sellQuota).format('0,0.00')">
                  <div slot="reference">
                    <el-progress type="circle" :width=70 :stroke-width=4 :percentage="getRewardInfoObj.paymentPersent" color="#0091FA" :show-text=false></el-progress>
                    <p class="overview-content__item-right--progress-text">完成度</p>
                  </div>
                </el-popover>
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card class="overview-content__item" shadow="never">
            <div class="overview-content__item-left">
              <p class="text-secondary">
                <span>招募会员 </span>
                <el-tooltip content="门店招募会员总数，包括门店招募和导购端手动添加会员；括号中显示所选门店至今所有招募会员总数">
                  <Icon type="question-circle"></Icon>
                </el-tooltip>
              </p>
              <p >
                <span class="font-size-large">{{getRewardInfoObj.memberCount}}</span>
                <!-- <el-countup
                  class="font-size-large"
                  :start="0"
                  :end="||0"
                  :duration="1.5">
                </el-countup> -->
                <span class="text-secondary">(总：{{getRewardInfoObj.memberTotal}})</span>
              </p>
            </div>
            <div class="overview-content__item-right">
               <el-popover
                  placement="top-start"
                  trigger="hover"
                  :content="'完成度：'+getRewardInfoObj.memberCountPersent+'% , 招募目标：'+getRewardInfoObj.recruitQuota">
                  <div slot="reference">
                    <el-progress  type="circle" :width=70 :stroke-width=4 :percentage="getRewardInfoObj.memberCountPersent" color="#f56c6c" :show-text=false>
                    </el-progress>
                    <p class="overview-content__item-right--progress-text">完成度</p>
                  </div>
                </el-popover>
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card class="overview-content__item" shadow="never">
            <div class="overview-content__item-left">
              <p class="text-secondary">
                <span>新加好友 </span>
                <el-tooltip content="门店新加好友总数，好友多次添加同一名导购微信不会重复计算；括号中显示所选门店至今所有新加好友总数">
                  <Icon type="question-circle"></Icon>
                </el-tooltip>
              </p>
              <p >
                <span class="font-size-large">{{getRewardInfoObj.addfriendCount}}</span>
                <!-- <el-countup
                  class="font-size-large"
                  :start="0"
                  :end="||0"
                  :duration="1.5">
                </el-countup> -->
                <span class="text-secondary">(总：{{getRewardInfoObj.addfriendTatal || 0}})</span>
              </p>
            </div>
            <div class="overview-content__item-right">
              <el-popover
                placement="top-start"
                trigger="hover"
                :content="'完成度：'+getRewardInfoObj.addfriendCountPersent+'% , 招募目标：'+getRewardInfoObj.addfriendQuota">
                <div slot="reference">
                  <el-progress  type="circle" :width=70 :stroke-width=4 :percentage="getRewardInfoObj.addfriendCountPersent" color="#B760DE" :show-text=false>
                  </el-progress>
                </div>
              </el-popover>
              <p class="overview-content__item-right--progress-text">完成度</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card class="overview-content__item" shadow="never">
              <p class="text-secondary">
                导购销售提成+招募奖励+新增好友奖励
              </p>
              <p class="overview-content__inline--block">
                <el-popover
                  placement="top-start"
                  trigger="hover"
                  :content="'￥' + $numeral(getRewardInfoObj.sellReward).format('0,0.00') + '+￥' + $numeral(getRewardInfoObj.recruitReward).format('0,0.00') + '+￥' + $numeral(getRewardInfoObj.addfriendReward).format('0,0.00')">
                  <div slot="reference">
                    <span class="font-size-large">￥</span>
                    <span class="font-size-xlarge">{{$numeral(getRewardInfoObj.reward).format('0,0.00')}}</span>
                  </div>
                </el-popover>
              </p>
          </el-card>
        </el-col>
      </el-row>
    <el-row class="overview-content__echart" :gutter="5">
      <el-col :span="12">
        <div class="overview-echart__item">
          <div class="overview-content__title">
            <span>销售趋势（元）</span>
          </div>
          <div v-loading.lock="loadingShopSell"
               :element-loading-text="$t('prompt.loading')">
            <!-- 暂无数据结构 -->
            <div class="no-data" v-if="!isSaleData" style='height:400px'>
            </div>
            <template v-if="isSaleData">
              <business-echarts :options="saleOption" class="oscillogram" auto-resize></business-echarts>
            </template>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="overview-echart__item">
          <div class="overview-content__title overview-content__title--pink">
            <span>招募会员趋势</span>
          </div>
          <div v-loading.lock="loadingRecruit"
               :element-loading-text="$t('prompt.loading')">
            <!-- 暂无数据结构 -->
            <div class="no-data" v-if="!isRecruitData" style='height:400px'>
            </div>
            <template v-if="isRecruitData">
              <business-echarts :options="recruitOption" class="oscillogram" auto-resize></business-echarts>
            </template>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="overview-content__echart" :gutter="5">
      <el-col :span="12">
        <div class="overview-echart__item">
          <div class="overview-content__title overview-content__title--pink">
            <span>新加好友趋势</span>
          </div>
          <div v-loading.lock="loadingRecruit"
               :element-loading-text="$t('prompt.loading')">
            <!-- 暂无数据结构 -->
            <div class="no-data" v-if="!isAddFriendData" style='height:500px'>
            </div>
            <template v-if="isAddFriendData">
              <business-echarts :options="addFriendOption"  :style="{height:'500px'}" class="oscillogram" auto-resize></business-echarts>
            </template>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="overview-echart__item overview-echart__item--big">
          <div class="overview-content__title overview-content__title--yellow">
            <span>导购提成及奖励</span>
          </div>
          <div v-loading.lock="loadingReward"
               :element-loading-text="$t('prompt.loading')">
            <!-- 暂无数据结构 -->
            <div class="no-data" v-if="!isRewardDate" style='height:500px'></div>
            <template v-if="isRewardDate">
              <business-echarts :options="rewardOption" class="oscillogram" auto-resize></business-echarts>
            </template>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="overview-content__echart" :gutter="5">
      <el-col :span="12">
        <div class="overview-echart__item overview-echart__item--larger">
          <div class="overview-content__title">
            <span>门店销售排行榜</span>
          </div>
          <div v-loading.lock="loadingShopSell"
               :element-loading-text="$t('prompt.loading')">
            <!-- 暂无数据结构 -->
            <div class="no-data" v-if="!isShopSellData" style='height:550px'>
            </div>
            <template v-if="isShopSellData">
              <business-echarts :options="shopSellOption" class="oscillogram" auto-resize></business-echarts>
            </template>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="overview-echart__item overview-echart__item--larger">
          <div class="overview-content__title">
            <span>导购销售排行榜</span>
          </div>
          <div v-loading.lock="loadingGuideSell"
               :element-loading-text="$t('prompt.loading')">
            <!-- 暂无数据结构 -->
            <div class="no-data" v-if="!isGuideSellData" style='height:550px'>
            </div>
            <template v-if="isGuideSellData">
              <business-echarts :options="guideSellOption" class="oscillogram" auto-resize></business-echarts>
            </template>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="overview-content__echart" :gutter="5">
      <el-col :span="12">
        <div class="overview-echart__item overview-echart__item--larger">
          <div class="overview-content__title">
            <span>门店招募排行榜</span>
          </div>
          <div v-loading.lock="loadingShopRecruit"
               :element-loading-text="$t('prompt.loading')">
            <!-- 暂无数据结构 -->
            <div class="no-data" v-if="!isShopRecruitData" style='height:550px'>
            </div>
            <template v-if="isShopRecruitData">
              <business-echarts :options="shopRecruitOption" class="oscillogram" auto-resize></business-echarts>
            </template>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="overview-echart__item overview-echart__item--larger">
          <div class="overview-content__title">
            <span>导购招募排行榜</span>
          </div>
          <div v-loading.lock="loadingGuideRecruit"
               :element-loading-text="$t('prompt.loading')">
            <!-- 暂无数据结构 -->
            <div class="no-data" v-if="!isGuideRecruitData" style='height:550px'>
            </div>
            <template v-if="isGuideRecruitData">
              <business-echarts :options="guideRecruitOption" class="oscillogram" auto-resize></business-echarts>
            </template>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="overview-content__echart" :gutter="5">
      <el-col :span="12">
        <div class="overview-echart__item overview-echart__item--larger">
          <div class="overview-content__title">
            <span>门店新加好友排行榜</span>
          </div>
          <div v-loading.lock="loadingAddFriend"
               :element-loading-text="$t('prompt.loading')">
            <!-- 暂无数据结构 -->
            <div class="no-data" v-if="!isNewAddFriendData" style='height:550px'>
            </div>
            <template v-if="isNewAddFriendData">
              <business-echarts :options="newAddFriendOption" class="oscillogram" auto-resize></business-echarts>
            </template>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="overview-echart__item overview-echart__item--larger">
          <div class="overview-content__title">
            <span>导购新加好友排行榜</span>
          </div>
          <div v-loading.lock="loadingGuideAddFriend"
               :element-loading-text="$t('prompt.loading')">
            <!-- 暂无数据结构 -->
            <div class="no-data" v-if="!isGuideAddFriendData" style='height:550px'>
            </div>
            <template v-if="isGuideAddFriendData">
              <business-echarts :options="guideAddFriendOption" class="oscillogram" auto-resize></business-echarts>
            </template>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import index from './src/index'
import businessEcharts from '@nascent/ecrp-ecrm/src/components/NsEcharts'
import ElProgress from '@nascent/nui/lib/progress'
import ElCard from '@nascent/nui/lib/card'
import ShopSelectLoad from '@/components/ShopSelectLoad'
export default index
index.components = {
  businessEcharts,
  ElProgress,
  ElCard,
  ShopSelectLoad
}
</script>

<style scoped>
  @import "@theme/variables.pcss";
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
            position: relative;
            padding: var(--default-padding-base);
            background-color: var(--theme-color-white);
            border: none;
            &:before {
              position: absolute;
              top: 0;
              left: 0;
              content: ' ';
              height: 5px;
              width: 100%;
              border-radius: var(--default-radius-mini);
            }
            >>>.el-card__body {
              height: 100px;
              padding: 20px;
              position: relative;
              span {
                font-weight: bold;
              }
              p {
                padding-top: 6px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .text-secondary {
                font-weight: normal;
              }
              .overview-content__item-left {
                margin-right: 65px;
              }
              .overview-content__item-right {
                position: absolute;
                top: 50%;
                right: 20px;
                margin-top: -30px;
                width: 70px;
                height: 70px;
                img {
                  width: 60px;
                  height: 60px;
                }
                .overview-content__item-right--progress-text {
                  position: absolute;
                  top: 34%;
                  left: 25%;
                  margin: 0;
                  padding: 0;
                }
              }
            }
            @m select {
              display: flex;
              align-items: center;
              >>> .el-select,.el-date-editor{
                /* padding-left: var(--default-padding-larger); */
                flex: 1;
              }
            }
            @m time {
              padding-top: 2px;
            }
            @m store {
              padding-top: var(--default-padding-base);
            }
          }
        }
        .el-col {
          &:first-child {
            .overview-content__item:before {
              background: var(--theme-color-success);
            }
          }
          &:nth-child(2) {
            .overview-content__item:before {
              background: var(--theme-color-primary);
            }
          }
          &:nth-child(3) {
            .overview-content__item:before {
              background: var(--theme-color-danger);
            }
          }
          &:nth-child(4) {
            .overview-content__item:before {
              background: #B760DE;
            }
          }
           &:nth-child(5) {
            .overview-content__item:before {
              background: var(--theme-color-warning);
            }
          }
        }
      }
      @e title {
        line-height: 30px;
        padding: var(--default-padding-small) var(--default-padding-small) var(--default-padding-small) 0;
        >span {
          font-weight: bold;
          position: relative;
          display: inline-block;
          line-height: 1;
          padding: 0 0 0 var(--default-padding-xlarger);
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

        @m color-pink {
          >span {
            &:before {
              background-color: #FF3A3A;
            }
          }
        }
        @m color-yellow {
          >span {
            &:before {
              background-color: #F7C71F;
            }
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
              background: url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QONaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YWJmOTRjYmQtN2UwZi0xZDQ1LWFhNDItZGZhNDc2NzJkZjRmIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg1NkQwQTM1Q0I5NDExRTg5Mzc4ODNFQTg0M0YyQzY2IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg1NkQwQTM0Q0I5NDExRTg5Mzc4ODNFQTg0M0YyQzY2IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmZjMjI1OGRlLWNlMDAtZjc0OC1hZTdiLTExNTc3N2FmNWFiYiIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmJlNWVjZDE3LWNiNjctMTFlOC05MmFjLWNlNDA1NzdlZjMxNyIvPiA8L3Jk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) center center no-repeat;
            }

            @m big {
              .echarts {
                height: 500px;
              }
            }
            @m larger {
              .echarts {
                height: 550px;
              }
            }
          }
        }
      }
    }
  }
  .overview-content .el-popover .el-popover__title{
    padding: 5px 0 !important;
  }
  .overview-content__inline--block {
    display: inline-block;
  }
  >>> .el-card {
    border-radius: var(--default-radius-mini);
  }
</style>
