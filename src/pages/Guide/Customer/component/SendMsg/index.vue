<template>
  <el-dialog
    title="设置好友收到的消息"
    :visible.sync="dialogVisible"
    width="659px"
    :before-close="handleClose"
  >
    <div class="content-view">
      <img :src="userImg" class="left-img"/>
      <div class="right-view">
        <div class="remind-text">由于工作变更，
          <span class="color-text">企业微信员工姓名@企微简称</span>
          小时后添加你的企业微信联系人，接替
          <span class="color-text">企业微信员工姓名@企微简称</span>
          继续为你提供服务
        </div>
        <div class="color-text">暂不添加</div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <ns-button @click="dialogVisible = false">取 消</ns-button>
      <ns-button type="primary" @click="dialogVisible = false">确 定</ns-button>
    </span>
  </el-dialog>
</template>

<script>
import baguser from '@/assets/baguser.png'
export default {
  name: 'sendMsg',
  data () {
    return {
      dialogVisible: false,
      userImg: baguser
    }
  },
  methods: {
    handleClose () {
      this.dialogVisible = true
    },
    showDialog () {
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
.content-view {
  width: 627px;
  background: #F2F2F2;
  margin-bottom: 28px;
  margin-top: 28px;
  padding: 32px;
  display: flex;
  flex-direction: row;
  .left-img {
    width: 35px;
    height: 35px;
  }
  .right-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 512px;
    margin-left: 16px;
    font-size: 14px;
    color: rgba(0,0,0,0.45);
    line-height: 22px;
    .remind-text {
      width: 320px;
    }
    .color-text {
      color: #0094FC;
    }
  }
}
</style>
