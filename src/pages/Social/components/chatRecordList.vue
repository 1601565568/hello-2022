<template>
  <div
    class="chatRecordListWarpper"
    id="chatRecordListWarpper"
    ref="chatRecordListWarpper"
  >
    <div class="chatRecordList" v-for="(item, index) in list" :key="index">
      <!-- 聊天左边 -->
      <div :class="item.user === 1 ? 'chatRecord_l' : 'chatRecord_R'">
        <img
          v-if="item.user === 1"
          class="user_pic"
          src="https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=4131746241,2477555401&fm=111&gp=0.jpg"
        />
        <div class="chatRecord_content">
          <div class="chatRecord_name_time">刘启竞 2020/07/18 12:00</div>
          <div class="chatRecord_text" v-if="item.type === 1">
            导购你好，我是张三。
          </div>
          <div class="chatRecord_img" v-if="item.type === 2">
            <img
              src="https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3363295869,2467511306&fm=26&gp=0.jpg"
            />
          </div>
          <div class="chatRecord_video" v-if="item.type === 3">
            <img
              src="https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3363295869,2467511306&fm=26&gp=0.jpg"
            />
            <div class="icon"></div>
          </div>
          <img
            class="chatRecord_redenvelopes"
            v-if="item.type === 4"
            src="https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/red%20envelopes1.png"
          />
          <img
            class="chatRecord_redenvelopes"
            v-if="item.type === 5"
            src="https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/red%20envelopes2.png"
          />
          <div class="chatRecord_share" v-if="item.type === 6">
            <div class="chatRecord_share__title">
              唇膏测评、涂啥口红都好看的秘诀？选好唇膏，唇纹是以…
            </div>
            <div class="chatRecord_share__content">
              <div class="chatRecord_share__Text">
                轻松get完美唇部状态轻松get完美唇部状态轻松get完美唇部状get完美唇部ge完美唇部完…
              </div>
              <img
                class="chatRecord_share__img"
                src="https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=4131746241,2477555401&fm=111&gp=0.jpg"
              />
            </div>
            <div class="chatRecord_share__user">
              <img
                class="chatRecord_share__user__img"
                src="https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=4131746241,2477555401&fm=111&gp=0.jpg"
              />
              <span class="chatRecord_share__user__name">小猪姐姐zz</span>
            </div>
          </div>
          <div class="chatRecord_map" v-if="item.type === 7">
            <div class="chatRecord_map_text">
              浙江省杭州市江干区九堡街道九和路东方电子商务园7…
            </div>
          </div>
        </div>
        <img
          v-if="item.user === 2"
          class="user_pic"
          src="https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=4131746241,2477555401&fm=111&gp=0.jpg"
        />
      </div>
    </div>
    <NsNoData v-if="false">暂无数据</NsNoData>
  </div>
</template>
<script>
import NsNoData from '@nascent/ecrp-ecrm/src/components/NsNoData.vue'
export default {
  components: { NsNoData },
  data () {
    return {
      list: [
        {
          user: 1,
          type: 1
        },
        {
          user: 1,
          type: 2
        },
        {
          user: 1,
          type: 3
        },
        {
          user: 1,
          type: 4
        },
        {
          user: 1,
          type: 7
        },
        {
          user: 2,
          type: 1
        },
        {
          user: 2,
          type: 1
        },
        {
          user: 2,
          type: 1
        },
        {
          user: 2,
          type: 1
        },
        {
          user: 2,
          type: 1
        }
      ]
    }
  },
  mounted () {
    this.scrollToBottom()
    document
      .getElementById('chatRecordListWarpper')
      .addEventListener(
        'scroll',
        this.throttle(this.scrollMoreData, 500, 1000),
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
        container.scrollTop = clientHeight + scrollHeight
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
      const clientHeight = this.$refs.chatRecordListWarpper.clientHeight
      const scrollHeight = this.$refs.chatRecordListWarpper.scrollHeight
      console.log(scrollTop, 'scrollTop')
      console.log(clientHeight, 'clientHeight')
      console.log(scrollHeight, 'scrollHeight')
      //   const scroll = scrollHeight - this.scrollDistance
      if (scrollTop + clientHeight >= scrollHeight) {
        console.log('滚动111111111')
        this.$emit('scroll')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chatRecordListWarpper {
  position: relative;
  padding: 32px 40px 0px 40px;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
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
    img {
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
  .chatRecord_share {
    width: 280px;
    height: 147px;
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
    .chatRecord_map_text {
      position: absolute;
      left: 0;
      bottom: 0;
      padding: 0 8px;
      width: 100%;
      height: 32px;
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
</style>
