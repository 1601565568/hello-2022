<template>
  <div class='account-content'>
    <div class='account-item' v-if='redpackType === normalRed'>
      <div class='account-name'>金额</div>
      <div class='account-value'>
        <span>{{money?$numeral(money).format('0,0.00'):'0.00'}}</span>元
      </div>
    </div>
    <template v-if='redpackType === luckyRed'>
      <div class='account-item'>
        <div class='account-name'>红包个数</div>
        <div class='account-value'>
          <span>0</span>个
        </div>
      </div>
      <div class='account-item' v-if='redpackType === luckyRed'>
        <div class='account-name'>总金额</div>
        <div class='account-value'>
          <span>{{moneyMin?$numeral(moneyMin).format('0,0.00'):'0.00'}}-{{moneyMax?$numeral(moneyMax).format('0,0.00'):'0.00'}}</span>元
        </div>
      </div>
    </template>
    <div class='account-item' v-if='redpackType === diyRed'>
      <div class='account-name'>金额</div>
      <div class='account-value'>
        <span>{{moneyMin?$numeral(moneyMin).format('0,0.00'):'0.00'}}-{{moneyMax?$numeral(moneyMax).format('0,0.00'):'0.00'}}</span>元
      </div>
    </div>
    <div class='account-item'>
      <div class='account-name'>{{benediction||'恭喜发财，大吉大利'}}</div>
    </div>
    <div class='account-item'>
      <div class='account-name'>红包封面</div>
      <img />
    </div>
    <div class='account-num'><span>¥{{redpackType === normalRed ? (money?$numeral(money).format('0,0.00'):'0.00'):'0.00'}}</span></div>
    <div class='red-btn'><span>塞钱进红包</span></div>
  </div>
</template>
<script>
import { normalRed, luckyRed, diyRed } from '../const'
export default {
  data () {
    return {
      normalRed, luckyRed, diyRed
    }
  },
  props: {
    money: {
      default: '0.00'
    },
    benediction: {
      default: '恭喜发财，大吉大利'
    },
    redpackType: {
      default: normalRed
    },
    moneyMin: {
      default: '0.00'
    },
    moneyMax: {
      default: '0.00'
    }
  }
}
</script>
<style lang="scss" scoped>
.account-content {
  background: #F5F5F5;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 2em 1.5em;
  .account-item {
    display: flex;
    color: #262626;
    justify-content: space-between;
    padding:0.9375em 1em;
    line-height: 1.5625em;
    background-color: #fff;
    border-radius: 0.25em;
    margin-bottom: 1.125em;
    word-break: break-all;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    span {
      margin-right: 0.5em;
    }
    .account-name {
      word-break: break-all;
      font-size: 1.0625em;
      word-break: break-all;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .account-value {
      word-break: break-all;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .account-num {
    color: #262626;
    font-weight: 500;
    line-height: 3em;
    margin-top: 4.3125em;
    text-align: center;
    word-break: break-all;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;
    overflow-y: visible;
    span {
      font-size: 3em;
    }
  }
  .red-btn {
    width: 11.0625em;
    height: 2.75em;
    text-align: center;
    line-height: 2.75em;
    background: #D06C49;
    margin: 1.875em auto 0 auto;
    border-radius: 0.25em;
    color: #FFFFFF;
    span {
      font-size: 1.125em;
    }
  }
}
</style>
