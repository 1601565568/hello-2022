<template>
  <el-drawer
    :visible.sync="drawer"
    :direction="direction"
    :before-close="handleClose"
    size="720px"
    :with-header="false"
  >
    <div>
      <div class="close-view">
        <Icon type="close" class="close-icon" @click="closeDeawer" />
      </div>
      <div class="drawer-title">拍摄指南</div>
      <div class="drawer-sub-title">坑位拍摄指南</div>
      <div class="drawer-sub-cont">
        4月12日，在外交部和湖北省人民政府举行的湖北全球特别推介活动上，3张对比照片令人印象深刻：黄鹤楼从空无一人到游人如织；户部巷从一度“空巷”到重拾人间烟火；东风公司从按下“暂停键”到每51秒下线一辆乘用车……从一个春天到又一个春天，湖北实现了凤凰涅槃、浴火重生。
        回望过去一年，面对突如其来的新冠肺炎疫情，在以习近平同志为核心的党中央坚强领导下，湖北坚持人民至上、生命至上，同时间赛跑，与病魔较量，进行了一场惊心动魄、艰苦卓绝的抗疫大战。大战大考，淬火成钢，英雄的湖北是怎样炼成的？面向未来，湖北又将为世界带来什么？
      </div>
    </div>
    <div class="drawer-sub-title">示意图</div>
    <img
      class="drawer-sub-img"
      src="https://th.bing.com/th/id/R9728a99d589530ccf7f31f3510f0e0b0?rik=9w4mzTsvbMBqcw&riu=http%3a%2f%2fpic.nipic.com%2f2008-03-01%2f2008311362975_2.jpg&ehk=JwAmi%2bkNv3xJZ3T7LyhC9hA%2bQ51KY%2fKiZ1d%2bBLX1ZCE%3d&risl=&pid=ImgRaw"
    />
  </el-drawer>
</template>
<script>
import ElDrawer from '@nascent/nui/lib/drawer'

export default {
  name: 'guideInfo',
  components: { ElDrawer },
  data () {
    return {
      direction: 'rtl',
      drawer: false
    }
  },
  methods: {
    closeDeawer () {
      this.drawer = !this.drawer
    },
    handleClose () {}
  }
}
</script>
<style scoped>
.drawer-title {
  height: 53px;
  font-size: 16px;
  color: #262626;
  line-height: 53px;
  padding-left: 16px;
}
.drawer-sub-title {
  font-size: 14px;
  color: #303133;
  line-height: 55px;
  font-weight: 500;
  padding-left: 32px;
  height: 55px;
}
.drawer-sub-cont {
  font-size: 14px;
  color: #606266;
  line-height: 24px;
  font-weight: 400;
  margin-left: 32px;
  margin-right: 32px;
  padding-bottom: 33px;
  border-bottom: 1px solid #e8e8e8;
}
.drawer-sub-img {
  width: 375px;
  height: 257px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  margin-left: 32px;
}
.close-view {
  height: 49px;
  display: flex;
  align-items: center;
}
.close-icon {
  margin-left: 16px;
  width: 20px;
  height: 20px;
}
</style>
