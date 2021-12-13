<template>
   <div class="taskProgressWarpper"
   :class="taskProgressStaute === 1? 'success': 'primary'" v-if='isShow'>
      <div class="taskProgressText">
        <Icon type="nssucceedcricle" v-if="taskProgressStaute === 1" class="iconFont iconFontsuccess"/>
        <Icon type="nswarmcricle" v-else class="iconFont iconFontPrimary" />
        <div class="status">
          <span>
            {{pageContent}}
            <ns-button v-if="showBtn" type="text" @click="onRedoCustomerTransferTask()">继续更换</ns-button>
            <ns-button v-if="showLookBtn" type="text" @click="lookTransDetail">查看详情</ns-button>
          </span>
          <div style="width:208px" v-if="shopCustomerTransferTaskStatus
            && parseInt(shopCustomerTransferTaskStatus.status) !== 3">
            <el-progress :text-inside="true" :stroke-width="8" :percentage="progress" :show-text="false"></el-progress>
          </div>
          <!-- <ns-button type="text">继续更换</ns-button> -->
          <span v-if="!shopCustomerTransferTaskStatus
            || (shopCustomerTransferTaskStatus&&parseInt(shopCustomerTransferTaskStatus.status) !== 3)">已更换{{progress}}%</span>
        </div>
      </div>
      <span @click="onCloseCustomerTransferTask"><Icon type="circleclose" class="iconFont" v-if="shopCustomerTransferTaskStatus && parseInt(shopCustomerTransferTaskStatus.status) === 3"/></span>
   </div>
</template>
<script>
import index from './src/index'
export default index
</script>
<style scoped>
.taskProgressWarpper {
  padding: 0 16px;
  height: 40px;
  display: flex;
  color: #595959;
  align-items: center;
  justify-content: space-between;
  border-radius: 2px;
  margin: 8px 0;
}
.taskProgressText {
  display: flex;
  align-items: center;
}
.status {
  display: flex;
  align-items: center;
}
.status span {
  display: inline-block;
  margin: 0 8px;
}
.success {
  background: #EDFAE1;
}
.primary {
  background: #F2F9FE;
}
.iconFont {
  font-size: 16px
}
.iconFontsuccess {
  color: #3FBD00;
}
.iconFontPrimary {
  color: #0091FA;
}
</style>
