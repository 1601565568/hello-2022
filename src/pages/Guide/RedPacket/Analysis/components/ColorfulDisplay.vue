<template>
  <el-row :gutter='16'>
    <template v-for='(item,index) in dataList'>
      <el-col :key='item.key' :span='24/dataList.length'>
        <div class='row-item' :style='`background-image:${colorList[index]}`'>
          <div class='nick'>{{item.nick}}</div>
          <div class='value' v-if='item.isMoney'>{{item.value/100 | moneyStr}}</div>
          <div class='value' v-else>{{item.value}}</div>
        </div>
      </el-col>
    </template>
  </el-row>
</template>
<script>
export default {
  props: {
    // 颜色列表
    colorList: {
      type: Array,
      default () {
        return ['linear-gradient(269deg, #4EB3FC 0%, #0091FA 100%)', 'linear-gradient(270deg, #F7BD5B 0%, #F49F10 100%)', 'linear-gradient(270deg, #A0E35E 0%, #67C230 100%)', 'linear-gradient(269deg, #8B4EFC 0%, #6A00FA 100%)']
      }
    },
    // 数据列表
    dataList: {
      type: Array,
      default () {
        return [
          {
            key: '1',
            nick: '累计转出金额（元）',
            value: '986,974.00'
          },
          {
            key: '2',
            nick: '今日转出金额（元）',
            value: '986,974.00'
          },
          {
            key: '3',
            nick: '员工转出金额（元）',
            value: '986,974.00'
          },
          {
            key: '4',
            nick: '裂变大师转出金额（元）',
            value: '986,974.00'
          }
        ]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.row-item {
  padding: 27px 0;
  color: #FFFFFF;
  text-align: center;
  border-radius: 4px;
  .nick {
    line-height: 24px;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .value {
    line-height: 32px;
    font-size: 24px;
  }
}
</style>
