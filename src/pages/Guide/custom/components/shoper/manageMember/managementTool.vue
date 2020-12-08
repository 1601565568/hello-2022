<template>
  <div class="managementToolwarpper">
    <div class="managementTool-title">管理工具</div>
    <div class="toolList">
      <div class="toolList-item" v-for="(item, index) in list" :key="index">
        <img class="toolList-item__icon" :src="formatImage(item.name)" />
        <p>{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      list: [
        {
          name: '新增员工'
        },
        {
          name: '设置提成'
        },
        {
          name: '素材库'
        },
        {
          name: '指标管理'
        },
        {
          name: '卡券管理'
        },
        {
          name: '订单管理'
        },
        {
          name: '切换账号'
        }
      ]
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
        case '切换账号':
          url = require(`../../../image/qiehuanzhanghu.png`)
      }
      return url
    }
  }
}
</script>

<style lang="scss" scoped>
.managementToolwarpper {
  padding-bottom: 8px;
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
      margin-bottom: 8px;
    }
  }
}
</style>
