<template>
  <div>
    <Phone>
      <template v-slot:content>
        <div class="content-view">
          <div>
            <img class="phone-view" src="../Images/iphoneName.jpg"/>
          </div>
          <div class="base-view" v-if="info.length>0">
            <img class="head-view" src="@/assets/default-avatar.png"/>
            <div class="info-view">
              {{info}}
            </div>
          </div>
          <div class="base-view" v-if="title || detail || url">
            <img class="head-view" src="@/assets/default-avatar.png"/>
            <div class="active-view">
              <div class="active-title">{{title}}</div>
              <div class="active-desc-view">
                <div class="active-info">{{detail}}</div>
                <img class="active-image" :src="url" v-if="url.length > 0"/>
              </div>
            </div>
          </div>
          <div>
            <img class="edit-view" src="@/assets/chat.png"/>
          </div>
        </div>
      </template>
    </Phone>
  </div>
</template>

<script>
import Phone from './Phone'
export default {
  name: 'welcome',
  components: {
    Phone
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    detail: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    info: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      defauletWelcome: `你好 , 我是<wise>员工微信昵称~</wise>\n恭喜你成功参与本次福利活动，分享活动邀请好友扫码添加<wise>员工微信昵称~</wise>为好友\n邀请5位好友即可领取奖品！奖品限量100份，先到先得哦！\n活动有效期：<wise>活动有效时间</wise>\n点击下方链接去分享吧 ↓↓
      `
    }
  }
}
</script>

<style scoped>
.content-view {
  position: relative;
  height: 100%;
}
.base-view {
  margin-top: 8px;
  display: flex;
  flex-direction: row;
}
.head-view {
  width: 35px;
  height: 35px;
  margin-left: 12px;
}
.info-view {
  padding: 8px;
  font-size: 12px;
  color: #262626;
  line-height: 20px;
  background: #FFFFFF;
  border-radius: 2px;
  width: 220px;
  margin-left: 8px;
  border-radius: 3px;
}
.active-view {
  margin-left: 8px;
  width: 198px;
  background: #FFFFFF;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  padding: 8px;
}
.active-title {
  font-size: 12px;
  color: #262626;
  line-height: 14px;
  font-weight: 500;
}
.active-desc-view {
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.active-info {
  width: 120px;
  color: #8C8C8C;
  line-height: 16px;
  font-size: 10px;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.active-image {
  width: 48px;
  height: 48px;
  background-color: lightgrey;
}
.phone-view {
  width: 320px;
  height: 64px;
  margin-bottom: 12px;
  object-fit: contain;
}
.edit-view {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 320px;
  height: 50px;
  object-fit: cover;
}
</style>
