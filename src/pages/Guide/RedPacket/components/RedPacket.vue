<template>
  <div class='red-content' :style='bgImage?`background-image:url(${bgImage})`:""'>
    <template v-if='!bgHasFont'>
      <img :src='redpacketbg' class='red-image'>
    </template>
    <template v-else>
      <img :src='redpacketbgHasFont' class='red-image'>
    </template>
    <div class='redpacket-text' v-if='!bgHasFont'>
      <div class='redpacket-name'>
        <img class='redpacket-userimg' :src='userImg'>
        <span>{{bagName}}</span>
      </div>
      <div class='redpacket-tip'>
        {{bagTip || '恭喜发财，大吉大利'}}
      </div>
    </div>
  </div>
</template>
<script>
import redpacketbg from '@/assets/redpacketbg.png'
import redpacketbgHasFont from '@/assets/redpacketbgHasFont.png'
import baguser from '@/assets/baguser.png'
export default {
  data () {
    return {
      redpacketbg, redpacketbgHasFont
    }
  },
  props: {
    bgHasFont: {
      default: false
    },
    bgImage: {
      type: String
    },
    userImg: {
      type: String,
      default: baguser
    },
    bagName: {
      type: String,
      default: '员工姓名发出的红包'
    },
    bagTip: {
      type: String,
      default: '恭喜发财，大吉大利'
    }
  }
}
</script>
<style lang="scss" scoped>
.red-content {
  width: 100%;
  padding-bottom: 19%;
  position: relative;
  background-color: #F25642;
  background-size:100% 100%;
  .red-image {
    width:100%;
  }
  .redpacket-text {
    position: absolute;
    top: 28%;
    left: 0;
    right: 0;
    color:#FFE0AF;
    .redpacket-name {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.733em;
      line-height: 1em;
      .redpacket-userimg {
        height: 1em;
        width: 1em;
        margin-right: 0.267em;
        border-radius: 2px;
      }
    }
    .redpacket-tip {
      line-height: 1.2em;
      margin-top: 0.6em;
      text-align: center;
      font-size:  0.933em;
      word-break: break-all;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      padding: 0 0.6em;
    }
  }
}
</style>
