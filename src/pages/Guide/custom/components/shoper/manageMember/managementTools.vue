<template>
  <div class="managementToolwarpper">
    <div class="managementTool-title">管理工具</div>
    <div class="toolList" v-if="show">
      <template v-for="(item, index) in editData">
        <div class="toolList-item" :key="index" v-if="item.status === 1">
          <img
            v-if="item.isDefaultMenu === 1"
            class="toolList-item__icon"
            :src="formatImage(item.itemName)"
          />
          <img v-else class="toolList-item__icon" :src="item.info.icon" />
          <p>{{ item.itemName }}</p>
        </div>
      </template>
      <div style="hetght:8px"></div>
    </div>
  </div>
</template>
<script>
import componentData from '../../mixins/componentData.js'
export default {
  name: 'managementTools',
  mixins: [componentData],
  data () {
    return {
    }
  },
  methods: {
    formatImage (name) {
      var url
      switch (name) {
        case '新增员工':
          url = require(`../../../image/xinzengyuangong.png`)
          break
        case '设置提成':
          url = require(`../../../image/shezhiticheng.png`)
          break
        case '素材库':
          url = require(`../../../image/sucaiku.png`)
          break
        case '指标管理':
          url = require(`../../../image/zhibiaoguanli.png`)
          break
        case '卡券管理':
          url = require(`../../../image/kaquanguanli.png`)
          break
        case '订单管理':
          url = require(`../../../image/dingdanguanli.png`)
          break
        case '切换账户':
          url = require(`../../../image/qiehuanzhanghu.png`)
          break
        case 'LBS群拉新':
          url = require(`../../../image/LBS.png`)
          break
        case '转移明细':
          url = require(`../../../image/transImg.png`)
          break
      }
      return url
    }
  }
}
</script>

<style lang="scss" scoped>
.managementToolwarpper {
  // padding-bottom: 8px;
  margin-bottom: 8px;
  background: #fff;
  .managementTool-title {
    padding: 0 16px;
    height: 48px;
    line-height: 48px;
    font-size: 15px;
    font-weight: bold;
    color: #262626;
  }
  .toolList {
    display: flex;
    flex-wrap: wrap;
    .toolList-item {
      width: 25%;
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      p {
        font-size: 13px;
        color: #595959;
      }
    }
    .toolList-item__icon {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      margin-bottom: 8px;
    }
  }
}
</style>
