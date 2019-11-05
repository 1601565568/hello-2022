<template>
  <div>
    <el-dialog
      title="详情"
      :visible.sync="sVisible"
      @closed="onClose"
      width="504px" class="detail-dialog">
      <div class="detail-dialog__content">
        <el-form label-width="80px" class="detail-leftside">
          <el-form-item label="微信号：" class="detail-leftside__item">
            <el-form-grid  class="detail-leftside__item--blackcolor detail-leftside__item--rowheight">{{ memberDetail.wname || memberDetail.wid || '-'}}</el-form-grid>
          </el-form-item>
          <el-form-item label="微信昵称：" class="detail-leftside__item">
            <el-form-grid class="detail-leftside__item--blackcolor">{{memberDetail.isOwner == "1" ? (memberDetail.ownerNick || '-') : (memberDetail.nick || '-')}}</el-form-grid>
          </el-form-item>
<!--            todo-zsf 暂无以下数据-->
          <el-form-item label="性别：" class="detail-leftside__item">
            <el-form-grid class="detail-leftside__item--blackcolor">-</el-form-grid>
          </el-form-item>
          <el-form-item label="地区：" class="detail-leftside__item">
            <el-form-grid class="detail-leftside__item--blackcolor">-</el-form-grid>
          </el-form-item>
          <el-form-item label="所属微信群：" class="detail-leftside__item">
            <el-form-grid class="detail-leftside__item--blackcolor">{{memberDetail.displayname || '-'}}</el-form-grid>
          </el-form-item>
          <el-form-item label="群公告：" class="detail-leftside__item">
            <el-form-grid class="detail-leftside__item--blackcolor">{{memberDetail.chatroomnotice || '-'}}</el-form-grid>
          </el-form-item>
          <el-form-item label="入会时间：" class="detail-leftside__item">
            <el-form-grid class="detail-leftside__item--blackcolor">{{memberDetail.activeTime || '-'}}</el-form-grid>
          </el-form-item>
          <el-form-item label="专属导购：" class="detail-leftside__item">
            <el-form-grid class="detail-leftside__item--blackcolor">{{memberDetail.guideName || '-'}}</el-form-grid>
          </el-form-item>
          <el-form-item label="是否与专属导购成为好友关系：" label-width="180px" class="detail-leftside__item">
            <el-form-grid class="delete-leftside__item--blackcolor">-</el-form-grid>
          </el-form-item>
        </el-form>
        <div class="detail-rightside">
          <img :src="memberDetail.isOwner == '1' ? (memberDetail.ownerHead || NO_IMG_BIG) : (memberDetail.head || NO_IMG_BIG)" class="detail-rightside__img" alt="头像">
        </div>
      </div>
      <span slot="footer">
        <ns-button @click="sVisible = false">关闭</ns-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Index from './src/memberDetail'

export default Index
</script>
<style scoped>
  @import '../src/dialog.pcss';
</style>
