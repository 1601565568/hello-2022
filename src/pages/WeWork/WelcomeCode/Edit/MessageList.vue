<template>
  <ul class="message-list">
    <li
      class="message-list-item"
      v-for="({ type, content }, key) in list"
      :key="key"
    >
      <div class="message-detail">
        <template v-if="content.percent < 100 && (type == 1 || type == 2)">
          <img src="@/assets/materical-loading.gif" class="bitpit" />
        </template>
        <template v-else>
          <Icon :type="WelcomeMessageTypeTip[type].icon" class="icon" />
        </template>
        <span>{{content | msgText(type)}}</span>
      </div>
      <div class="message-order" :class="{ 'first-line': key === 0 }">
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
      </div>
      <div class="message-operate">
        <ns-button v-show="isShowEdit({ type, content })" type="text" size="small" @click="editMessage({ type, content }, key)">编辑</ns-button>
        <ns-button type="text" size="small" @click="deleteMessage({ type, content },key)">删除</ns-button>
      </div>
      <el-progress v-if="content.percent < 100 && (type == 1 || type == 2)" class="progress" :stroke-width="1" :show-text="false" :percentage="Number(content.percent)" :color="customColor"></el-progress>
    </li>
  </ul>
</template>

<script>
import { WelcomeMessageType, WelcomeMessageTypeTip } from '../types'
import ElProgress from '@nascent/nui/lib/progress'
export default {
  components: {
    ElProgress
  },
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  filters: {
    msgText (content, type) {
      switch (type) {
        case WelcomeMessageType.Image:
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
.message-list {
  width: 626px;
  list-style: none;
  padding: 0;
  .message-list-item {
    display: flex;
    align-items: center;
    height: 52px;
    border-bottom: 1px solid #e8e8e8;
    position: relative;

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
        font-size: 16px;
        margin-left: 9px;
      }
      span {
        margin-left: 5px;
        line-height: 20px;
        display: inline-block;
        width: 180px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
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
      margin-left: 69px;
      width: 128px;
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
