<template>
  <div class="overview">
    <el-row class="overview_top" :gutter="5">
      <el-col :span="6">
        <div class="overview_top_item  overview_top_item_one">
          <div class="one_content">
            <div class="one_content_lf flex">
              <div>
                <span class='span_xmd'>时间 ：</span>
                <el-form-grid size="xmd">
                  <el-date-picker
                    prefix-icon='none'
                    @change='change'
                    v-model="searchObj.monthDate"
                    type="month"
                    clear-icon='none'
                    placeholder="选择月">
                  </el-date-picker>
                </el-form-grid>
              </div>
              <div>
                <span class='span_xmd'>门店 ：</span>
                <el-form-grid size="xmd">
                  <el-select v-model="searchObj.id" filterable placeholder="请选择门店" @change='shopSelect(searchObj.id)'>
                  <el-option
                    v-for="(item,index) in shopArr"
                    :key="item.id"
                    :label="item.shopName"
                    :value="item.id">
                  </el-option>
                  </el-select>
                </el-form-grid>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" >
        <div class="overview_top_item overview_top_item_two">
            <div class='two_content flex flex-between'>
              <div class='two_content_lf flex'>
                <span class='span_tit'>销售金额</span>
                <span class='span_num'>+{{getRewardInfoObj.payment||'0.00'}}</span>
              </div>
              <el-progress type="circle" :percentage="getRewardInfoObj.paymentPersent" :width='70' color='#0091fa'></el-progress>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="overview_top_item overview_top_item_two overview_top_item_three">
            <div class='two_content flex flex-between'>
              <div class='two_content_lf flex'>
                <span class='span_tit'>招募会员</span>
                <span class='span_num'>+{{getRewardInfoObj.memberCount || '0.00'}}
                  <i class='span_rg'>(总 :12405931)</i>
                </span>
              </div>
              <el-progress type="circle" :percentage="getRewardInfoObj.memberCountPersent" :width='70' color='#ff5c5c' ></el-progress>
          </div>
        </div>
      </el-col>
      <el-col :span="6" >
        <div class="overview_top_item overview_top_item_two overview_top_item_four">
            <div class='two_content flex flex-between'>
              <div class='two_content_lf flex'>
                <span class='span_tit'>导购提成奖励+招募奖励</span>
                <span class='span_num'>{{getRewardInfoObj.reward !=null? '¥' + getRewardInfoObj.reward :''}}
                  <i class='span_rg'>（￥{{getRewardInfoObj.sellReward ?  getRewardInfoObj.sellReward :'0.00'}}+￥{{getRewardInfoObj.recruitReward ? getRewardInfoObj.recruitReward :'0.00'}}）</i>
                </span>
              </div>
          </div>
        </div>
      </el-col>

    </el-row>
    <el-row :gutter="5" style='margin-top:5px'>
        <el-col :span="12">
        <div class='bg_white sell_echarts' v-loading.lock="loadingSell" :element-loading-text="$t('prompt.loading')">
          <div class="sell_echarts_flag"></div>
          <template v-if="!isSellData">
            <div class="no-data"  style='height:442px'></div>
            <div class="echarts_title">销售趋势</div>
          </template>
          <template v-if="isSellData">
            <business-echarts :options="sellOption" class="oscillogram" auto-resize ></business-echarts>
          </template>
        </div>
      </el-col>
      <el-col :span="12">
        <div class='bg_white recruit_echarts' v-loading.lock="loadingRecruit" :element-loading-text="$t('prompt.loading')">
          <div class="recruit_echarts_flag"></div>
          <template v-if="!isRecruitData">
            <div class="no-data" style='height:442px'></div>
            <div class="echarts_title">招募会员趋势</div>
          </template>
          <template v-if="isRecruitData">
            <business-echarts :options="recruitOption" class="oscillogram" auto-resize></business-echarts>
          </template>
      </div>
      </el-col>
    </el-row>
    <el-row  style='margin-top:5px'>
        <div class='bg_white reward_echarts' v-loading.lock="loadingReward" :element-loading-text="$t('prompt.loading')">
          <div class="reward_echarts_flag"></div>
          <template v-if="!isRewardDate">
            <div class="no-data"  style='height:500px'></div>
            <div class="echarts_title">导购提成及奖励</div>
          </template>
          <template v-if="isRewardDate">
            <business-echarts :options="rewardOption" class="oscillogram" auto-resize></business-echarts>
          </template>

        </div>
    </el-row>
    <el-row :gutter="5" style='margin-top:5px'>
      <el-col :span="12">
        <div class='bg_white shopSellOption_echarts' v-loading.lock="loadingShopSell" :element-loading-text="$t('prompt.loading')">
          <div class="shop_sell_echarts_flag"></div>
           <template v-if="!isShopSellData">
            <div class="no-data" style='height:680px'></div>
            <div class="echarts_title">门店销售排行榜</div>
          </template>
          <template v-if="isShopSellData">
            <business-echarts :options="shopSellOption" class="oscillogram" auto-resize></business-echarts>
          </template>
        </div>
      </el-col>
      <el-col :span="12">
        <div class='bg_white guideSellOption_echarts' v-loading.lock="loadingGuideSell" :element-loading-text="$t('prompt.loading')">
          <div class="guide_sell_echarts_flag"></div>
          <template  v-if="!isGuideSellData">
            <div class="no-data"  style='height:680px'></div>
            <div class="echarts_title">导购销售排行榜</div>
          </template>
          <template v-if="isGuideSellData">
            <business-echarts :options="guideSellOption" class="oscillogram" auto-resize></business-echarts>
          </template>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="5" style='margin-top:5px'>
        <el-col :span="12">
        <div class='bg_white shopRecruitOption_echarts' v-loading.lock="loadingShopRecruit" :element-loading-text="$t('prompt.loading')">
          <div class="shop_recruit_echarts_flag"></div>
          <template v-if="!isShopRecruitData">
            <div class="no-data"  style='height:680px'></div>
            <div class="echarts_title">门店招募排行榜</div>
          </template>
          <template v-if="isShopRecruitData">
            <business-echarts :options="shopRecruitOption" class="oscillogram" auto-resize></business-echarts>
          </template>
        </div>
      </el-col>
      <el-col :span="12">
        <div class='bg_white guideRecruitOption_echarts' v-loading.lock="loadingGuideRecruit" :element-loading-text="$t('prompt.loading')">
          <div class="guide_recruit_echarts_flag"></div>
          <template v-if="!isGuideRecruitData">
            <div class="no-data"  style='height:680px'></div>
            <div class="echarts_title">导购招募排行榜</div>
          </template>
           <template v-if="isGuideRecruitData">
            <business-echarts :options="guideRecruitOption" class="oscillogram" auto-resize></business-echarts>
          </template>

        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import index from './src/index.js'
  export default index
</script>
<style scoped lang='scss'>
  @import "../../style/small/variables.pcss";
  .bg_white{
    background: #ffffff
  }
  .overview_top_item{
    height:106px;
    border-radius: 4px;
    padding-top: 4px;
    padding-left: 0px !important;
    padding-right: 0px !important;
    &.overview_top_item_one{
      background-color:#0091fa;
    }
    &.overview_top_item_two{
      background-color:#50d065;
    }
    &.overview_top_item_three{
      background-color:#ff5c5c;
    }
    &.overview_top_item_four{
      background-color:#fdc400;
    }
  }
  .one_content{
    background-color: #fff;
    height: 102px;
    .one_content_lf{
      height: 86px;
      padding-top: 16px;
      margin: 0 auto;
      flex-direction: column;
      align-items: center;
      .span_xmd{
        position: relative;
        top: 3px;
      }
    }
  }
  .overview_top_item_two {
    .two_content{
      background-color: #fff;
      height: 102px;
      padding: 0 40px 0 44px;
       .two_content_lf{
        flex: 1;
        height: 60px;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        .span_tit{
          font-size: 14px;
          font-weight: blod;
          color:#999;
        }
        .span_num{
          font-size: 20px;
          font-weight: blod;
          color:#000;
          .span_rg{
            font-size: 12px;
            color: #999;
            font-style: normal;
            font-weight: normal;
          }
        }
      }
    }
  }
  .subtitle{
    font-size: 17px;
    line-height: 16px;
    color: #333;
    padding: 20px 20px 20px 37px;
    font-weight: 600;
    border-bottom:1px solid #D8D8D8;
    position: relative;
    &:before {
      position: absolute;
      content: '';
      width: 5px;
      height: 17px;
      border-radius: 2px;
      background-color:blue;
      left: 20px;
      top: 20px;
    }
  }
  .no-data {
    width: 100%;
    height: 360px;
    background: url("data:image/png;base64,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") center center no-repeat;
  }
</style>
<style>
  .echarts_title{
    position: absolute;
      font-size: 17px;
      font-weight: 900;
      left: 37px;
      top: 18px;
  }
  .overview .one_content_lf .el-input__inner{
    border-radius: 15px !important;
    padding-left: 15px !important;
  }
  .overview .one_content_lf .el-input__suffix{
    right: 9px !important;
  }
  .overview .one_content_lf .el-input__suffix .el-select__caret{
    margin-left: 5px !important;
  }
  .sell_echarts{
    position: relative;
  }
  .sell_echarts .echarts{
    height: 442px !important;
  }
  .sell_echarts .sell_echarts_flag{
    position: absolute;
    left: 20px ;
    top: 20px ;
    border-radius: 2px ;
    width: 5px;
    height: 17px ;
    background: rgb(18,153,250,0.6);
  }
  .recruit_echarts{
    position: relative;
  }
  .recruit_echarts .recruit_echarts_flag{
    position: absolute;
    left: 20px ;
    top: 20px ;
    border-radius: 2px ;
    width: 5px;
    height: 17px ;
    background: rgb(255,58,58,0.6);
  }
  .recruit_echarts .echarts{
    height: 442px !important;
  }
  .reward_echarts{
    position: relative;
  }
  .reward_echarts .reward_echarts_flag{
    position: absolute;
    left: 20px ;
    top: 20px ;
    border-radius: 2px ;
    width: 5px;
    height: 17px ;
    background: rgb(247,199,31);
  }
  .reward_echarts .echarts{
    height: 500px !important;
  }
  /* 门店销售，导购销售echarts */
  .shopSellOption_echarts {
    position: relative;
  }
  .shopSellOption_echarts .echarts{
    height: 680px !important;
  }
  .shopSellOption_echarts .shop_sell_echarts_flag{
    position: absolute;
    left: 20px ;
    top: 20px ;
    border-radius: 2px ;
    width: 5px;
    height: 17px ;
    background: #3963ff;
  }
  .guideSellOption_echarts {
    position: relative;
  }
  .guideSellOption_echarts .echarts{
    height: 680px !important;
  }
  .guideSellOption_echarts .guide_sell_echarts_flag{
    position: absolute;
    left: 20px ;
    top: 20px ;
    border-radius: 2px ;
    width: 5px;
    height: 17px ;
    background: #a963ff;
  }
  /* 门店招募，导购招募echarts */
  .shopRecruitOption_echarts {
    position: relative;
  }
  .shopRecruitOption_echarts .echarts{
    height: 680px !important;
  }
  .shopRecruitOption_echarts .shop_recruit_echarts_flag{
    position: absolute;
    left: 20px ;
    top: 20px ;
    border-radius: 2px ;
    width: 5px;
    height: 17px ;
    background: #ff5215;
  }
  .guideRecruitOption_echarts {
    position: relative;
  }
  .guideRecruitOption_echarts .echarts{
    height: 680px !important;
  }
  .guideRecruitOption_echarts .guide_recruit_echarts_flag{
    position: absolute;
    left: 20px ;
    top: 20px ;
    border-radius: 2px ;
    width: 5px;
    height: 17px ;
    background: #1fc47c;
  }
</style>