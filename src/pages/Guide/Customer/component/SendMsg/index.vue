<template>
  <el-dialog
    title="设置好友收到的消息"
    :visible.sync="dialogVisible"
    width="659px"
    :before-close="handleClose"
  >
    <div class="content-view">
      <img class="bar-view" src="@/assets/sendMsgBar.jpg"/>
      <div class="send-msg-view">
        <img :src="userImg" class="left-img"/>
        <div class="right-view">
          <div class="send-info-view">
            <tag-area
              v-model="activityIntroduction"
              tag="wise"
              ref="tagAreaText"
              className="tagAreaText"
              :maxlength="100"
              :tools="tools"
              placeholder="请输入活动介绍"
              :showEmoji="false"
              :showTextEmoji="false"
              :isShowDefault="false"
            />
          </div>
          <div class="remind-text">由于工作变更，
            <span class="color-text">企业微信员工姓名@企微简称</span>
            将在24小时后添加你的企业微信联系人，接替
            <span class="color-text">企业微信员工姓名@企微简称</span>
            继续为你提供服务
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <span class="show-default-text" @click="showDefaultText">恢复默认</span>
      <div>
        <ns-button @click="dialogVisible = false">取 消</ns-button>
        <ns-button type="primary" @click="dialogVisible = false">确 定</ns-button>
      </div>
    </span>
  </el-dialog>
</template>

<script>
import baguser from '@/assets/baguser.png'
import TagArea from '@/components/NewUi/TagArea'
export default {
  name: 'sendMsg',
  components: {
    TagArea
  },
  data () {
    return {
      dialogVisible: false,
      userImg: baguser,
      activityIntroduction: '',
      tools: [
        { type: 'tag', text: '企业微信员工姓名', id: 'guideUserId', value: '企业微信员工姓名' },
        { type: 'tag', text: '企业简称', id: 'corpName', value: '@企业简称' }
      ],
      defaultWelcome: `您好，您的服务已升级，后续将由我的同事{guideUserId}{corpName}接替我的工作，继续为您服务。`
    }
  },
  methods: {
    showDefaultText () {
      this.defaultText()
    },
    handleClose () {
      this.dialogVisible = true
    },
    showDialog () {
      this.dialogVisible = true
      this.defaultText()
    },
    defaultText () {
      this.$nextTick(() => {
        if (this.$refs.tagAreaText) {
          const text = this.$refs.tagAreaText.stringTohtml(this.defaultWelcome)
          this.$refs.tagAreaText.$refs[this.$refs.tagAreaText.className].innerHTML = text
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.content-view {
  background: #F2F2F2;
  margin-bottom: 28px;
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  .bar-view {
    height: 64px;
    width: 100%;
  }
  .send-msg-view {
    display: flex;
    flex-direction: row;
    padding: 24px;
  }
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
  .send-info-view {
    width: 512px;
    background-color: white;
    margin-bottom: 32px;
    border-radius: 4px;
    padding: 12px 10px 0 10px;
  }
}
.dialog-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .show-default-text {
    font-size: 14px;
    color: #0392FB;
    cursor: pointer;
  }
}
</style>
