<template>
  <div
    class="chatRecordListWarpper"
    id="chatRecordListWarpper"
    ref="chatRecordListWarpper"
  >
    <!-- <el-scrollbar ref="fullScreen" style="height:100%"> -->
    <div class="chatRecordList-content">
      <div
        class="chatRecordList"
        v-for="(item, index) in dataList"
        :key="index"
      >
        <!-- 聊天左边 -->
        <div :class="item.left ? 'chatRecord_l' : 'chatRecord_R'">
          <!-- 用户头像位置左边 -->
          <img v-if="item.left" class="user_pic" :src="item.avatar" />
          <div class="chatRecord_content">
            <div class="chatRecord_name_time">
              {{ item.name }} {{ item.msgtime }}
            </div>
            <div class="chatRecord_text" v-if="item.msgtype === 'text'">
              {{item.content}} <a :href="item.content_url" target=_blank>{{item.content_url}}</a>
            </div>
            <div
              class="chatRecord_img"
              v-if="item.msgtype === 'image'"
              @click="onSee(item.content, 1)"
            >
              <img :src="item.content" />
            </div>
            <div class="chatRecord_img" v-if="item.msgtype === 'emotion'">
              <img :src="item.content" />
            </div>
            <div
              class="chatRecord_video"
              v-if="item.msgtype === 'video'"
              @click="onSee(item.content, 2)"
            >
              <video :src="item.content" />
              <div class="icon"></div>
            </div>
            <div
              class="chatRecord_voice"
              v-if="item.msgtype === 'voice'"
              @click="openRecording(item.content, item.seq)"
            >
              <img
                v-if="voiceActive !== item.seq"
                src="../ChatRecord/image/voice.png"
              />
              <img v-else src="../ChatRecord/image/voice.gif" />
              <!-- <audio
                src="https://shopguide.oss-cn-hangzhou.aliyuncs.com/chatdata/20210206/ww9e54b9a67fdab9ec/voice/17972312999583483861_1612582456-3251d4f023f8b227915a5096144d1f9a"
                ref="callAudio"
                controls="controls"
              ></audio> -->
              <!-- <audio controls>
                <source :src="item.content" />
                <source src="horse.mp3" />
                您的浏览器不支持 audio 元素。
              </audio> -->
            </div>
            <img
              class="chatRecord_redenvelopes"
              v-if="item.msgtype === 'redpacket' || item.msgtype === 'external_redpacket'"
              src="https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/red%20envelopes1.png"
            />
            <!-- <img
                class="chatRecord_redenvelopes"
                v-if="item.type === 5"
                src="https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/red%20envelopes2.png"
              /> -->
            <div class="chatRecord_share" v-if="item.msgtype === 'link'">
              <div class="chatRecord_share__title">
                {{ item.title }}
              </div>
              <div class="chatRecord_share__content">
                <div class="chatRecord_share__Text">
                  {{ item.description }}
                </div>
                <img class="chatRecord_share__img" :src="item.image_url" />
              </div>
              <div class="chatRecord_share__user">
                <img class="chatRecord_share__user__img" :src="item.avatar" />
                <span class="chatRecord_share__user__name">{{
                  item.sender
                }}</span>
              </div>
            </div>
            <div class="chatRecord_map" v-if="item.msgtype === 'location'">
              <div class="chatRecord_map_text">
                {{ item.content }}
              </div>
            </div>
          </div>
          <!-- 用户头像位置右边 -->
          <img v-if="!item.left" class="user_pic" :src="item.avatar" />
        </div>
      </div>
    </div>
    <div class="more" v-if="dataList.length !== 0">
      <span @click="getMore">查看更多</span>
    </div>
    <NsNoData v-if="dataList.length === 0">暂无数据</NsNoData>
    <el-dialog title="查看" :visible.sync="dialogVisible" width="30%">
      <template v-if="type === 1">
        <img :src="url" />
      </template>
      <template v-if="type === 2">
        <video
          :src="url"
          autoplay="autoplay"
          loop="loop"
          muted="muted"
          controls="controls"
          controlsList="nodownload"
          height="100%"
          width="100%"
        />
      </template>
      <span slot="footer" class="dialog-footer">
        <ns-button type="primary" @click="dialogVisible = false"
          >确 定</ns-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import NsNoData from '@nascent/ecrp-ecrm/src/components/NsNoData.vue'
import BenzAMRRecorder from 'benz-amr-recorder'
export default {
  components: { NsNoData },
  props: {
    dataList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      isScroll: true, // 是否可以滚动加载更多
      scrollHeight: 0,
      playRec: null, // 播放对象
      voiceActive: null,
      dialogVisible: false,
      isGetMore: false, // 判断是否是点击查看更多用来设置滚动条位置
      url: '',
      type: 1
    }
  },
  watch: {
    'dataList.length': {
      handler (newVal, oldVal) {
        if (newVal !== oldVal && newVal > oldVal) {
          this.isScroll = true
          if (this.isGetMore) {
            this.isGetMore = false
            return
          }
          this.$nextTick(() => {
            document
              .getElementById('chatRecordListWarpper')
              .scrollTo(
                0,
                this.$refs.chatRecordListWarpper.scrollHeight -
                  this.scrollHeight -
                  50
              )
            this.scrollHeight = this.$refs.chatRecordListWarpper.scrollHeight
          })
        } else {
          this.isScroll = false
        }
      }
    }
  },
  mounted () {
    this.scrollToBottom()
    // this.handleScroll()
    const container = document.getElementById('chatRecordListWarpper')
    this.scrollHeight = container.scrollHeight
    container.addEventListener(
      'scroll',
      this.throttle(this.scrollMoreData, 10, 30),
      false
    )
  },
  methods: {
    /**
     * 进入页面页面置底
     */
    scrollToBottom () {
      this.$nextTick(() => {
        let container = this.$refs.chatRecordListWarpper
        const clientHeight = this.$refs.chatRecordListWarpper.clientHeight
        const scrollHeight = this.$refs.chatRecordListWarpper.scrollHeight
        container.scrollTop = clientHeight + scrollHeight + 32
      })
    },
    throttle (func, wait, mustRun) {
      var timeout
      var startTime = new Date()
      return function () {
        var context = this
        var args = arguments
        var curTime = new Date()
        clearTimeout(timeout)
        // 如果达到了规定的触发时间间隔，触发 handler
        if (curTime - startTime >= mustRun) {
          func.apply(context, args)
          startTime = curTime
          // 没达到触发间隔，重新设定定时器
        } else {
          timeout = setTimeout(func, wait)
        }
      }
    },
    scrollMoreData () {
      const scrollTop = this.$refs.chatRecordListWarpper.scrollTop
      // console.log(this.isScroll, 'this.isScroll')
      if (scrollTop <= 10) {
        if (this.isScroll) {
          this.isScroll = false
          this.$emit('handleScrollTop')
        }
      }
    },
    getMore () {
      this.isGetMore = true
      this.$emit('getMore')
    },
    // 播放语音
    openRecording (_url, seq) {
      // let url = _url.split('.com')[1]
      // console.log(url, 'urlurl')
      let vm = this
      if (vm.playRec !== null) {
        vm.stopPlayVoice()
      }
      vm.playRec = new BenzAMRRecorder()
      // ⚠️注意跨域问题
      vm.playRec
        .initWithUrl(_url)
        .then(function () {
          vm.voiceActive = seq
          vm.playRec.play()
          vm.playRec.onEnded(function () {
            vm.voiceActive = null
          })
        })
        .catch(e => {
          vm.$notify.error('播放录音失败')
        })
    },
    // 放大查看
    onSee (content, type) {
      this.url = content
      this.type = type
      this.dialogVisible = true
    },
    // 停止播放
    stopPlayVoice () {
      if (this.playRec.isPlaying()) {
        this.playRec.stop()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chatRecordListWarpper {
  position: relative;
  height: 100%;
  overflow-y: auto;
  /*scrollbar-width: none;*/
  /*&::-webkit-scrollbar {*/
  /*  display: none;*/
  /*}*/
}
.chatRecordList-content {
  padding: 32px 40px 0px 40px;
}
.chatRecordList {
  margin-bottom: 32px;
}
.chatRecord_l,
.chatRecord_R {
  display: flex;
  font-size: 14px;
  .user_pic {
    height: 40px;
    width: 40px;
    border-radius: 4px;
    object-fit: cover;
    margin-right: 16px;
  }
  .chatRecord_name_time {
    color: #8c8c8c;
    margin-bottom: 4px;
  }
  .chatRecord_text {
    display: inline-block;
    word-wrap: break-word;
    max-width: 300px;
    padding: 16px;
    color: #262626;
    line-height: 22px;
    background: #fff;
    border-radius: 4px;
  }
  .chatRecord_img {
    // min-width: 122px;
    width: 122px;
    height: 122px;
    img {
      border-radius: 2px;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
  .chatRecord_video {
    position: relative;
    width: 122px;
    height: 122px;
    &::before {
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      background: rgba($color: #000000, $alpha: 0.25);
    }
    video {
      position: relative;
      border-radius: 2px;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
    .icon {
      position: absolute;
      width: 36px;
      height: 36px;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      z-index: 3;
      background: url('https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/videoPlay.png')
        no-repeat;
      background-size: 100%;
    }
  }
  .chatRecord_voice {
    width: 168px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    height: 54px;
    background: #fff;
    border-radius: 4px;
    img {
      width: 16px;
      height: 16px;
      image-rendering: -moz-crisp-edges;
      image-rendering: -o-crisp-edges;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
      -ms-interpolation-mode: nearest-neighbor;
    }
  }
  .chatRecord_share {
    width: 280px;
    max-height: 147px;
    padding: 0 12px;
    padding-top: 8px;
    color: #262626;
    background: #fff;
    .chatRecord_share__title {
      font-size: 16px;
      margin-bottom: 2px;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .chatRecord_share__content {
      display: flex;
      align-items: center;
      .chatRecord_share__Text {
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
      .chatRecord_share__img {
        width: 52px;
        height: 52px;
        object-fit: cover;
        margin-left: 12px;
      }
    }
    .chatRecord_share__user {
      margin-top: 10px;
      position: relative;
      height: 28px;
      display: flex;
      align-items: center;
      font-size: 12px;
      &::before {
        position: absolute;
        content: '';
        width: 100%;
        height: 1px;
        top: 0px;
        left: 0px;
        background: #eeeeee;
      }
      .chatRecord_share__user__img {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        margin-right: 4px;
      }
    }
  }
  .chatRecord_redenvelopes {
    width: 247px;
    height: 92px;
  }
  .chatRecord_map {
    position: relative;
    width: 360px;
    height: 200px;
    background: url('https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/map.png')
      no-repeat;
    background-size: 100%;
    .chatRecord_map_text {
      position: absolute;
      left: 0;
      bottom: 0;
      padding: 0 8px;
      width: 100%;
      height: 32px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      color: #ffffff;
      line-height: 32px;
      background: rgba(0, 0, 0, 0.65);
    }
  }
}
.chatRecord_R {
  display: flex;
  justify-items: flex-end;
  .chatRecord_text {
    background: #0091fa;
    color: #fff;
  }
  .chatRecord_content {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-end;
  }
  .user_pic {
    height: 40px;
    width: 40px;
    border-radius: 4px;
    object-fit: cover;
    margin-left: 16px;
  }
}
.more {
  text-align: center;
  font-size: 14px;
  color: #595959;
  text-align: center;
  line-height: 22px;
  padding-bottom: 32px;
  span {
    cursor: pointer;
  }
}
</style>
