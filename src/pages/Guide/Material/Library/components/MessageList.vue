<template>
  <ul class="message-list">
    <draggable :list="list" :disabled="isUploading" @update="datadragEnd">
      <li
        class="message-list-item"
        v-for="({ type, content }, key) in list"
        :key="key"
      >
        <div class="message-detail">
          <template v-if="type !== 0">
            <template v-if="content.percent < 100 && (type == 1 || type == 2)">
              <img src="@/assets/materical-loading.gif" class="bitpit" />
            </template>
            <template v-else>
              <Icon :type="WelcomeMessageTypeTip[type].icon" class="icon" />
            </template>
          </template>
          <template v-else>
            <img class="bitpit" src="@/assets/kwBig.png" alt="">
          </template>
          <span v-if="type !== 0">
            <span v-if="type === 5">{{content.title}}</span>
            <span v-if="type === 1">{{getFileName(content.image || '')}}</span>
            <span v-else-if="type === 2">
              <span v-if="content.percent">{{content.video}}</span>
              <span v-else>{{getFileName(content.video || '')}}</span>
            </span>
            <span v-else>
              {{content | msgText(type)}}
            </span>
          </span>
          <span v-else>自建坑位</span>
        </div>
        <!-- <div class="message-order" :class="{ 'first-line': key === 0 }">
          <ns-button v-show="key !== 0 && isShowEdit({ type, content })" type="text" @click="sortMessage(key, 'top')">
            <Icon type="zhiding" />
          </ns-button>
          <ns-button v-show="key !== 0 && isShowEdit({ type, content })" type="text" @click="sortMessage(key, 'up')">
            <Icon type="top-arr" />
          </ns-button>
          <ns-button v-show="key !== list.length - 1 && isShowEdit({ type, content })" type="text" @click="sortMessage(key, 'down')">
            <Icon type="down-arr" />
          </ns-button>
          <ns-button v-show="key !== list.length - 1 && isShowEdit({ type, content })" type="text" @click="sortMessage(key, 'bottom')">
            <Icon type="zhidi" />
          </ns-button>
        </div> -->
        <div class="message-operate">
          <ns-button type="text" size="small" @click="editMessage({ type, content }, key)" :disabled="isUploading">
            <span class="iconfont icon-zidingyibeifen" style="font-size:20px;"></span>
          </ns-button>
          <ns-button type="text" size="small" @click="deleteMessage({ type, content },key)" :disabled="isUploading">
            <span class="iconfont icon-ns-delete1" style="font-size:24px;"></span>
          </ns-button>
          <ns-button type="text" size="small" :disabled="isUploading">
            <span class="iconfont icon-a-tuodongbeifen18" style="font-size:24px;"></span>
          </ns-button>
        </div>
        <el-progress v-if="content.percent < 100 && (type == 1 || type == 2)" class="progress" :stroke-width="2" :show-text="false" :percentage="Number(content.percent)" :color="customColor"></el-progress>
      </li>
    </draggable>
  </ul>
</template>

<script>
import { WelcomeMessageType, WelcomeMessageTypeTip } from '../types'
import ElProgress from '@nascent/nui/lib/progress'
import { fileName } from '@/utils/fileName'
import draggable from 'vuedraggable'
export default {
  components: {
    ElProgress,
    draggable
  },
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      }
    },
    isUploading: {
      type: Boolean,
      default: false
    }
  },
  filters: {
    msgText (content, type) {
      switch (type) {
        case WelcomeMessageType.Image || WelcomeMessageType.ImageCode:
          return content.image.slice(content.image.lastIndexOf('/') + 1)
        case WelcomeMessageType.Video:
          return content.video.slice(content.video.lastIndexOf('/') + 1)
        case WelcomeMessageType.Link:
        case WelcomeMessageType.MiniProgram:
        case WelcomeMessageType.Poster:
          return content.title
        case WelcomeMessageType.Pitbit:
          return content.pitText
        default:
          return ''
      }
    }
  },
  data () {
    return {
      WelcomeMessageType: WelcomeMessageType,
      WelcomeMessageTypeTip: WelcomeMessageTypeTip,
      customColor: '#0094FC'
    }
  },
  methods: {
    datadragEnd (list) {
      this.$emit('dragUploadList', this.list)
    },
    getFileName (url) {
      return fileName(url)
    },
    isShowEdit (data) {
      let isShow
      if (data.type !== 1 && data.type !== 2) {
        isShow = true
      } else {
        if (parseInt(data.content.percent) < 100) {
          isShow = false
        } else {
          isShow = true
        }
      }
      return isShow
    },
    /**
     * 改变消息顺序
     * @param index 当前消息位置
     * @param direction 改变方向 top up down bottom
     */
    sortMessage (index, direction) {
      const list = [ ...this.list ]

      const [ delItem ] = list.splice(index, 1)
      if (direction === 'top') {
        list.unshift(delItem)
      } else if (direction === 'bottom') {
        list.push(delItem)
      } else if (direction === 'up') {
        list.splice(index - 1, 0, delItem)
      } else if (direction === 'down') {
        list.splice(index + 1, 0, delItem)
      }
      this.$emit('update:list', list)
    },
    deleteMessage (data, index) {
      this.$emit('delete', { ...data, index, isDelete: true })
      const list = [ ...this.list ]
      list.splice(index, 1)
      this.$emit('update:list', list)
    },
    editMessage (data, index) {
      this.$emit('edit', { ...data, index })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-progress-bar__outer,
.el-progress-bar__inner {
    border-radius: none;
}
.message-list {
  width: 540px;
  list-style: none;
  padding: 0;
  .message-list-item {
    display: flex;
    align-items: center;
    height: 52px;
    border-bottom: 1px solid #e8e8e8;
    position: relative;
    justify-content: space-between;

    .message-detail {
      width: 212px;
      display: flex;
      align-items: center;
      .bitpit{
        width: 20px;
        height: 20px;
        margin-left: 9px;
      }
      .icon {
        font-size: 20px;
        margin-left: 9px;
        margin-right: 0px;
      }
      span {
        line-height: 20px;
        height: 20px;
        display: inline-block;
        width: 180px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: left;
        margin-left: 5px;
      }
    }

    .message-order {
      margin-left: 69px;
      width: 156px;
      padding: 0 20px;
      .el-button + .el-button {
        margin-left: 16px;
      }
    }

    .first-line {
      display: flex;
      justify-content: flex-end;
    }

    .message-operate {
      // margin-left: 67px;
      width: 128px;
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
    }
    .progress {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
    }
  }
}

</style>
