<template>
  <div class='strategies-container'>
    <div class='blue-tip'>Tips：可选红包为在“内容管理->红包工具->红包策略”已开启的红包</div>
    <div class='dialog'>
      <div class='dialog-list'>
        <el-input v-model="model.name" placeholder="请输入红包名称"  @keyup.enter.native="handleSearch">
          <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
        </el-input>
        <el-scrollbar v-if='_data._table.data && _data._table.data.length' Zref="fullScreen" style='height:400px'>
          <template v-for='item in _data._table.data'>
            <div :key='item.id' class='radio-item'>
              <el-radio :value="checkItem.id" :label="item.id" @change='handleChangeCheckItem(item)'>{{item.name}}</el-radio>
            </div>
          </template>
        </el-scrollbar>
        <template v-else>
          <img :src='nodatabox' class='empty-img'>
          <p class='empty-text'>没有数据哦～</p>
        </template>
      </div>
      <div class='dialog-content' v-if='checkItem.id'>
        <div class='packet-box'>
          <RedPacket :bgImage='checkItem.background' :bagTip='checkItem.benediction'/>
        </div>
        <div class='packet-info'>
          <h3 class='packet-name'>{{redpacketTypeMap[checkItem.redpackType]}}</h3>
          <div class='packet-detail'>有效期：{{checkItem.timeType === timeTypeForever ? '不限' : `${checkItem.startTime}至${checkItem.endTime}`}}</div>
          <div class='packet-detail'>红包总数：{{checkItem.total}}个</div>
          <div class='packet-detail'>剩余个数：{{checkItem.remainder}}个</div>
          <div class='packet-detail' v-if='checkItem.redpackType === normalRed'>单个金额：{{checkItem.money/100 | moneyStr}}元</div>
          <div class='packet-detail' v-else>红包金额：{{checkItem.moneyMin/100 | moneyStr}}-{{checkItem.moneyMax/100 | moneyStr}}元（员工自定义）</div>
          <div class='packet-detail'>发放上限：{{checkItem.everyoneLimit ? `${checkItem.everyoneLimit}个/人/日` : '不限'}}</div>
        </div>
      </div>
    </div>
    <div class='page-content' v-if='_data._table.data && _data._table.data.length'>
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
  </div>
</template>
<script>
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import RedPacket from './RedPacket'
import nodatabox from '@/assets/nodatabox.png'
import { redpacketTypeMap, normalRed, luckyRed, diyRed, timeTypeForever } from '../const'
export default {
  data () {
    return {
      url: this.$api.guide.redpacket.getStrategiesList,
      model: {
        name: '',
        state: 1,
        launchType: 1
      },
      checkItem: {},
      redpacketTypeMap,
      normalRed,
      luckyRed,
      diyRed,
      nodatabox,
      timeTypeForever
    }
  },
  props: ['chooseItem'],
  components: { RedPacket },
  mixins: [tableMixin],
  mounted () {
    this.checkItem = this.chooseItem
    this.$reload()
  },
  methods: {
    handleChangeCheckItem (value) {
      this.checkItem = value
    },
    handleSearch () {
      this.$searchAction$()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.page-content {
  border-top: 1px solid #E8E8E8;
  padding: 10px 0;
}
.dialog {
  display: flex;
  .dialog-list {
    width: 40%;
    box-sizing: border-box;
    padding: 16px 40px 16px 6px;
    position: relative;
    &:after {
      content: ' ';
      position: absolute;
      right: 0;
      width: 1px;
      height: 392px;
      background: #E8E8E8;
      top: 56px;
    }
    .search-icon {
      font-size: 25px;
    }
    .radio-item {
      margin-top: 8px;
      height: 32px;
      font-size: 14px;
      color: #303133;
      display: flex;
      align-items: center;
    }
  }
  .dialog-content {
    width: 60%;
    padding:0 40px;
    display: flex;
    align-items: center;
    margin-top: 40px;
    .packet-box {
      width: 200px;
      min-width: 200px;
      font-size: 16px;
    }
    .packet-info {
      margin-left: 40px;
      .packet-name {
        font-size: 14px;
        color: #262626;
        height: 23px;
        margin-bottom: 16px;
      }
      .packet-detail {
        font-size: 12px;
        color: #262626;
        line-height: 23px;
        margin-bottom: 8px;
      }
    }
  }
}
.empty-img {
  width: 220px;
  height: 220px;
  display: block;
  margin: 40px auto;
}
.empty-text {
  font-size: 14px;
  color: #8C8C8C;
  text-align: center;
}
</style>
<style scoped>
.radio-item >>> .el-radio__label {
  font-size: 14px;
  font-weight: 400;
}
</style>
